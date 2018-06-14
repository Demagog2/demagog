# frozen_string_literal: true

class Source < ApplicationRecord
  belongs_to :medium, optional: true
  has_many :articles
  has_many :statements
  has_many :statement_transcript_positions
  has_and_belongs_to_many :speakers
  belongs_to :media_personality, optional: true

  default_scope { where(deleted_at: nil) }

  def self.matching_name(name)
    where("name LIKE ?", "%#{name}%")
  end
end
