# frozen_string_literal: true

class Medium < ApplicationRecord
  default_scope { where(deleted_at: nil) }

  has_many :sources
  has_and_belongs_to_many :media_personalities
  belongs_to :attachment, optional: true

  has_one_attached :logo

  def self.matching_name(name)
    where("name LIKE ?", "%#{name}%")
  end

  def self.create_medium(medium_input)
    medium = medium_input.deep_symbolize_keys

    ids = medium[:media_personalities].map { |m| m[:media_personality_id] }
    medium[:media_personalities] = MediaPersonality.where(id: ids)

    Medium.create! medium
  end

  def self.update_medium(id, medium_input)
    medium = medium_input.deep_symbolize_keys

    ids = medium[:media_personalities].map { |m| m[:media_personality_id] }
    medium[:media_personalities] = MediaPersonality.where(id: ids)

    Medium.update id, medium
  end
end
