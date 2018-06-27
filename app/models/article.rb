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
    order(published_at: :desc)
      .find_by(published: true)
  end

  def self.create_article(article_input)
    defaults = {
      article_type: ArticleType.find_by(name: "default")
    }

    article = defaults.merge(article_input.deep_symbolize_keys)

    if article[:segments]
      article[:segments] = article[:segments].map do |seg|
        if seg[:segment_type] == Segment::TYPE_TEXT
          Segment.new(segment_type: seg[:segment_type], text: seg[:text])
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

    article[:segments] = article[:segments].map do |seg|
      segment = ensure_segment(seg[:id])

      if seg[:segment_type] == Segment::TYPE_TEXT
        segment.assign_attributes(
          segment_type: seg[:segment_type],
          text: seg[:text]
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
      article[:segments].each do |seg|
        seg.save
      end

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
