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
  has_and_belongs_to_many :sources, join_table: "sources_experts"

  has_one_attached :avatar

  def full_name
    "#{first_name} #{last_name}"
  end

  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.active.find_by(email: data["email"])
    user
  end

  # Devise uses Warden to save information about current user to session and
  # saves into session two pieces of information [1], result of user.to_key,
  # which is user id, and authenticatable_salt, which is by default part of
  # encrypted password [2]. Since we dont have passwords in Demagog app,
  # authenticatable_salt is nil and in session is only user id. To make sure
  # we dont misidentify user, we therefore implement authenticatable_salt as
  # partial hash of email.
  #
  # [1] https://github.com/heartcombo/devise/blob/master/lib/devise/models/authenticatable.rb#L237-L239
  # [2] https://github.com/heartcombo/devise/blob/master/lib/devise/models/database_authenticatable.rb#L176-L178
  def authenticatable_salt
    Digest::SHA256.hexdigest(email)[0, 29]
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

    User.order(rank: :asc)
  end

  def self.create_user(user_input)
    user_input = user_input.deep_symbolize_keys
    user_input[:active] = true
    User.create!(user_input)
  end

  def self.delete_user(id)
    user = User.find(id)

    if user.comments.size > 0 || user.assessments.size > 0 || user.sources.size > 0 || user.notifications.size > 0
      user.errors.add(:base, :is_linked_to_some_data,
        message: "cannot be deleted if it is already linked to some comments, assessments, etc.")
      raise ActiveModel::ValidationError.new(user)
    end

    user.discard
  end
end
