# frozen_string_literal: true

class ArticleTagStatement < ApplicationRecord
  belongs_to :article_tag
  belongs_to :statement
end
