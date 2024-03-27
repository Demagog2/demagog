# frozen_string_literal: true

class WorkshopAbility
  include CanCan::Ability

  def initialize(user)
    can :read, Workshop

    return unless user.present?

    if user.role?(Role::EXPERT) || user.role?(Role::ADMIN) || user.role?(Role::SOCIAL_MEDIA_MANAGER)
      can :manage, Workshop
    end
  end
end
