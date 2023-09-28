# frozen_string_literal: true

class ArticleTagAbility
  include CanCan::Ability

  def initialize(user)
    can :read, ArticleTag

    return unless user.present?

    can :manage, ArticleTag
  end
end
