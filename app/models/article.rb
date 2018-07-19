# frozen_string_literal: true

class Article < ApplicationRecord
  extend FriendlyId

  default_scope { where(deleted_at: nil) }

  after_initialize :set_defaults

  belongs_to :article_type
  belongs_to :source, optional: true
  belongs_to :user, optional: true
  belongs_to :document, class_name: "Attachment", optional: true
  has_many :article_has_segments, dependent: :destroy
  has_many :segments, through: :article_has_segments
  has_many :statements, through: :segments
  has_many :speakers, through: :statements
  has_many :attachments, through: :speakers

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
    where("title LIKE ?", "%#{title}%")
  end

  def author
    self.user
  end

  def unique_speakers
    speakers.distinct
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
      article[:segments] = article[:segments].map do |seg|
        if seg[:segment_type] == Segment::TYPE_TEXT
          Segment.new(segment_type: seg[:segment_type], text_html: seg[:text_html], text_slatejson: seg[:text_slatejson])
        else
          statements = Statement.where(id: seg[:statements])
          Segment.new(segment_type: seg[:segment_type], statements: statements)
        end
      end
    end

    Article.create! article
  end

  def self.update_article(id, article_input)
    article = article_input.deep_symbolize_keys

    article[:article_type] = ArticleType.find_by!(name: article[:article_type])

    article[:segments] = article[:segments].map do |seg|
      segment = ensure_segment(seg[:id])

      if seg[:segment_type] == Segment::TYPE_TEXT
        segment.assign_attributes(
          segment_type: seg[:segment_type],
          text_html: seg[:text_html],
          text_slatejson: seg[:text_slatejson]
        )
      else
        segment.assign_attributes(
          segment_type: seg[:segment_type],
          statements: Statement.where(id: seg[:statements])
        )
      end

      segment
    end

    Article.transaction do
      article[:segments].each(&:save)

      Article.update(id, article)
    end
  end

  def self.ensure_segment(id)
    begin
      Segment.find(id)
    rescue ActiveRecord::RecordNotFound => err
      Segment.new
    end
  end
end
