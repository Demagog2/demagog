class ArticleTag < ApplicationRecord
  has_and_belongs_to_many :statements
  has_many :article_tag_speakers

  enum :stats, { none: 0, articles: 1, statements: 2 }
end
