# frozen_string_literal: true

class ArticleType < ApplicationRecord
  DEFAULT = "default" # Overeno
  STATIC = "static" # Komentar
  SINGLE_STATEMENT = "single_statement"
  FACEBOOK_FACTCHECK = "facebook_factcheck"

  has_many :articles
end
