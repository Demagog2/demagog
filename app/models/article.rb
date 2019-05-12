# frozen_string_literal: true

class Article < ApplicationRecord
  extend FriendlyId
  include Discardable

  default_scope { kept }

  after_initialize :set_defaults

  belongs_to :article_type
  belongs_to :user, optional: true
  belongs_to :document, class_name: "Attachment", optional: true
  has_many :segments, class_name: "ArticleSegment", dependent: :destroy

  has_one_attached :illustration

  friendly_id :title, use: :slugged

  scope :published, -> {
    where(published: true)
      .where("published_at <= NOW()")
  }

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

  def unique_speakers
    return [] unless source

    source
      .speakers
      .distinct
      .order(last_name: :asc, first_name: :asc)
  end

  def speaker_stats(speaker)
    ArticleStat.where(article_id: id, speaker_id: speaker.id).normalize
  end

  def self.cover_story
    published
      .order(published_at: :desc)
      .first
  end

  def self.create_article(article_input)
    article = article_input.deep_symbolize_keys

    article[:article_type] = ArticleType.find_by!(name: article[:article_type])

    if article[:segments]
      article[:segments] = article[:segments].map.with_index(0) do |seg, order|
        if seg[:segment_type] == ArticleSegment::TYPE_TEXT
          ArticleSegment.new(
            segment_type: seg[:segment_type],
            text_html: seg[:text_html],
            text_slatejson: seg[:text_slatejson],
            order: order
          )
        elsif seg[:segment_type] == ArticleSegment::TYPE_SOURCE_STATEMENTS
          source = Source.find(seg[:source_id])
          ArticleSegment.new(
            segment_type: seg[:segment_type],
            source: source,
            order: order
          )
        elsif seg[:segment_type] == ArticleSegment::TYPE_PROMISE
          ArticleSegment.new(
            segment_type: seg[:segment_type],
            promise_url: seg[:promise_url],
            order: order
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

    article[:segments] = article[:segments].map.with_index(0) do |seg, order|
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
          segment_type: seg[:segment_type],
          source: Source.find(seg[:source_id]),
          order: order
        )
      elsif seg[:segment_type] == ArticleSegment::TYPE_PROMISE
        segment.assign_attributes(
          segment_type: seg[:segment_type],
          promise_url: seg[:promise_url],
          order: order
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
    rescue ActiveRecord::RecordNotFound => err
      ArticleSegment.new
    end
  end
end
