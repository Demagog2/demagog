# frozen_string_literal: true

class User < ApplicationRecord
  include Discardable

  devise :trackable, :omniauthable, omniauth_providers: [:google_oauth2]

  default_scope { kept }
  scope :active, -> { where(active: true) }

  has_and_belongs_to_many :roles, join_table: :users_roles
  has_many :comments
  has_many :assessments
  has_many :notifications, foreign_key: "recipient_id"

  has_one_attached :avatar

  def full_name
    "#{first_name} #{last_name}"
  end

  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.active.find_by(email: data["email"])
    user
  end

  # We right now expect exactly one role per user
  def role
    roles.first
  end
  def role_id=(value)
    self.roles = [Role.find(value)]
  end

  def display_in_notification
    "#{first_name} #{last_name}"
  end

  def self.matching_name(name)
    where(
      "first_name || ' ' || last_name ILIKE ? OR UNACCENT(first_name || ' ' || last_name) ILIKE ?",
      "%#{name}%",
      "%#{name}%"
    )
  end

  def self.update_users_rank(ordered_user_ids)
    User.transaction do
      User.update_all(rank: nil)

      unless ordered_user_ids.nil?
        ordered_user_ids.each_with_index do |user_id, index|
          User.find(user_id).update!(rank: index)
        end
      end
    end

    User.all
  end
end
