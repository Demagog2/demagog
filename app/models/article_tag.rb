# frozen_string_literal: true

class ArticleTag < ApplicationRecord
  has_and_belongs_to_many :statements, join_table: "article_tag_statements"
  has_and_belongs_to_many :articles, join_table: "article_tag_articles"

  extend FriendlyId

  scope :published, -> { where(published: true) }

  friendly_id :title, use: :slugged

  def self.matching_title(title)
    where("title ILIKE ? OR UNACCENT(title) ILIKE ?", "%#{title}%", "%#{title}%")
  end
end
