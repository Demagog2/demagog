# frozen_string_literal: true

class ArticleTagArticle < ApplicationRecord
  belongs_to :article_tag, optional: true
  belongs_to :article, optional: true
  # TODO: Maybe rather source speaker?
  # belongs_to :source_speaker
end
