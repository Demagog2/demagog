# frozen_string_literal: true

class User < ApplicationRecord
  devise :trackable, :omniauthable, omniauth_providers: [:google_oauth2]

  scope :active, -> { where(active: true) }

  has_and_belongs_to_many :roles, join_table: :users_roles
  has_many :comments
  has_many :assessments
  belongs_to :portrait, class_name: "Attachment", optional: true

  has_one_attached :avatar

  def full_name
    "#{first_name} #{last_name}"
  end

  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.active.find_by(email: data["email"])
    user
  end
end
