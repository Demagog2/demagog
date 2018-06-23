# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :statement
  belongs_to :user

  validates :content, presence: true, length: { minimum: 1 }

  scope :ordered, -> {
    order(created_at: :asc)
  }
end
