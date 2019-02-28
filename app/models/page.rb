# frozen_string_literal: true

class Page < ApplicationRecord
  extend FriendlyId
  include Discardable

  default_scope { kept }

  scope :published, -> {
    where(published: true)
  }

  friendly_id :title, use: :slugged

  def self.matching_title(title)
    where("title LIKE ?", "%#{title}%")
  end
end
