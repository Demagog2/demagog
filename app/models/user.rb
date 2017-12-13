# frozen_string_literal: true

class User < ApplicationRecord
  has_and_belongs_to_many :roles, join_table: :users_roles
  has_many :comments
  has_many :assessments
  belongs_to :portrait, class_name: "Attachment", optional: true

  def full_name
    "#{first_name} #{last_name}"
  end
end
