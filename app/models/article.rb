# frozen_string_literal: true

class Article < ApplicationRecord
  extend FriendlyId
  include Discardable
  include Searchable

  after_create { ElasticsearchWorker.perform_async(:article, :index, self.id) }
  after_update { ElasticsearchWorker.perform_async(:article, :update, self.id) }
  after_discard { ElasticsearchWorker.perform_async(:article, :destroy, self.id) }

  after_initialize :set_defaults

  belongs_to :article_type
  belongs_to :user, optional: true
  belongs_to :document, class_name: "Attachment", optional: true
  has_many :segments, class_name: "ArticleSegment", dependent: :destroy

  has_one_attached :illustration

  friendly_id :title, use: :slugged

  scope :published, -> { where(published: true).where("published_at <= NOW()") }

  scope :for_homepage, -> {
    joins(:article_type)
      .where("article_types.name IN (?)", [ArticleType::DEFAULT, ArticleType::STATIC, ArticleType::SINGLE_STATEMENT])
  }

  mapping do
    indexes :id, type: "long"
    ElasticMapping.indexes_text_field self, :title
    ElasticMapping.indexes_text_field self, :perex
    ElasticMapping.indexes_text_field self, :segments_text
    indexes :published, type: "boolean"
    indexes :published_at, type: "date"

    # Special types for factcheck articles, so they are searchable also by medium or moderators
    indexes :article_type_default_indexed_context do
      indexes :medium do
        ElasticMapping.indexes_name_field self, :name
      end
      indexes :media_personalities do
        ElasticMapping.indexes_name_field self, :name
      end
    end
  end

  def as_indexed_json(options = {})
    as_json(
      only: %i[
        id
        title
        perex
        segments_text
        published
        published_at
        article_type_default_indexed_context
      ],
      methods: %i[segments_text article_type_default_indexed_context]
    )
  end

  def self.query_search_published(query)
    search(
      query: {
        bool: {
          must: { simple_query_string: simple_query_string_defaults.merge(query: query) },
          filter: [{ term: { published: true } }, { range: { published_at: { lte: "now" } } }]
        }
      },
      sort: [{ published_at: { order: "desc" } }]
    )
  end

  def segments_text
    segments.text_type_only.reduce("") do |result, segment|
      result + Nokogiri.HTML(segment.text_html).text
    end
  end

  def article_type_default_indexed_context
    return {} if article_type.name != ArticleType::DEFAULT || !source

    medium = nil
    medium = source.medium.slice("name") if source.medium

    media_personalities =
      source.media_personalities.map { |media_personality| media_personality.slice("name") }

    { medium: medium, media_personalities: media_personalities }
  end

  def set_defaults
    self.published ||= false
  end

  def self.matching_title(title)
    where("title ILIKE ? OR UNACCENT(title) ILIKE ?", "%#{title}%", "%#{title}%")
  end

  def author
    self.user
  end

  def source
    source_statements_segment = segments.source_statements_type_only.first
    source_statements_segment ? source_statements_segment.source : nil
  end

  def statements
    source_statements_segment = segments.source_statements_type_only.first
    source_statements_segment ? source_statements_segment.all_published_statements : nil
  end

  def single_statement
    single_statement_segment = segments.single_statement_only.first
    single_statement_segment ? single_statement_segment.statement : nil
  end

  def unique_speakers
    return [] unless source

    source.speakers.distinct.order(last_name: :asc, first_name: :asc)
  end

  def speaker_stats(speaker)
    ArticleStat.where(article_id: id, speaker_id: speaker.id).normalize
  end

  def self.create_article(article_input)
    article = article_input.deep_symbolize_keys

    article[:article_type] = ArticleType.find_by!(name: article[:article_type])

    if article[:segments]
      article[:segments] =
        article[:segments].map.with_index(0) do |seg, order|
          if seg[:segment_type] == ArticleSegment::TYPE_TEXT
            ArticleSegment.new(
              segment_type: seg[:segment_type],
              text_html: seg[:text_html],
              text_slatejson: seg[:text_slatejson],
              order: order
            )
          elsif seg[:segment_type] == ArticleSegment::TYPE_SOURCE_STATEMENTS
            source = Source.find(seg[:source_id])
            ArticleSegment.new(segment_type: seg[:segment_type], source: source, order: order)
          elsif seg[:segment_type] == ArticleSegment::TYPE_PROMISE
            ArticleSegment.new(
              segment_type: seg[:segment_type], promise_url: seg[:promise_url], order: order
            )
          elsif seg[:segment_type] == ArticleSegment::TYPE_SINGLE_STATEMENT
            ArticleSegment.new(
              segment_type: seg[:segment_type], statement_id: seg[:statement_id], order: order
            )
          else
            raise "Creating segment of type #{seg[:segment_type]} is not implemented"
          end
        end
    end

    Article.create! article
  end

  def self.update_article(article_id, article_input)
    article = article_input.deep_symbolize_keys

    article[:article_type] = ArticleType.find_by!(name: article[:article_type])

    article[:segments] =
      article[:segments].map.with_index(0) do |seg, order|
        segment = ensure_segment(seg[:id], article_id)

        if seg[:segment_type] == ArticleSegment::TYPE_TEXT
          segment.assign_attributes(
            segment_type: seg[:segment_type],
            text_html: seg[:text_html],
            text_slatejson: seg[:text_slatejson],
            order: order
          )
        elsif seg[:segment_type] == ArticleSegment::TYPE_SOURCE_STATEMENTS
          segment.assign_attributes(
            segment_type: seg[:segment_type], source: Source.find(seg[:source_id]), order: order
          )
        elsif seg[:segment_type] == ArticleSegment::TYPE_PROMISE
          segment.assign_attributes(
            segment_type: seg[:segment_type], promise_url: seg[:promise_url], order: order
          )
        elsif seg[:segment_type] == ArticleSegment::TYPE_SINGLE_STATEMENT
          segment.assign_attributes(
            segment_type: seg[:segment_type], statement_id: seg[:statement_id], order: order
          )
        else
          raise "Updating segment of type #{seg[:segment_type]} is not implemented"
        end

        segment
      end

    Article.transaction do
      article[:segments].each(&:save)

      Article.update(article_id, article)
    end
  end

  def self.ensure_segment(segment_id, article_id)
    article = Article.find(article_id)

    begin
      article.segments.find(segment_id)
    rescue ActiveRecord::RecordNotFound
      ArticleSegment.new
    end
  end
end
