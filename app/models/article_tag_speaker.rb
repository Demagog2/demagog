class ArticleTagSpeaker < ApplicationRecord
  belongs_to :article_tag
  belongs_to :speaker
  # TODO: Maybe rather source speaker?
  # belongs_to :source_speaker
end
