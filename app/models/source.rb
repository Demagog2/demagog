# frozen_string_literal: true

class Source < ApplicationRecord
  belongs_to :medium, optional: true
  has_many :articles
  has_many :statements
  has_and_belongs_to_many :speakers
  belongs_to :media_personality, optional: true

  def self.matching_name(name)
    where("name LIKE ?", "%#{name}%")
  end
end
