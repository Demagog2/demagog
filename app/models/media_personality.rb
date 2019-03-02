# frozen_string_literal: true

class MediaPersonality < ApplicationRecord
  include Discardable

  default_scope { kept }

  has_and_belongs_to_many :sources, join_table: "sources_media_personalities"
  belongs_to :attachment, optional: true

  def self.matching_name(name)
    where("name ILIKE ?", "%#{name}%")
  end

  def self.delete_media_personality(id)
    media_personality = MediaPersonality.find(id)

    if media_personality.sources.size > 0
      media_personality.errors.add(:base, :is_linked_to_some_sources,
        message: "cannot be deleted if it is linked to some sources")
      raise ActiveModel::ValidationError.new(media_personality)
    end

    media_personality.discard
  end
end
