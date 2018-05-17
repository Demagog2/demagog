# frozen_string_literal: true

class Source < ApplicationRecord
  belongs_to :medium
  has_many :articles
  has_many :statements
  belongs_to :media_personality
end
