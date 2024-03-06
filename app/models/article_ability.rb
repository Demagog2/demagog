# frozen_string_literal: true

class ArticleAbility
  include CanCan::Ability

  def initialize(user)
    return unless user.present?

    if user.role?(Role::EXPERT) || user.role?(Role::ADMIN) || user.role?(Role::SOCIAL_MEDIA_MANAGER)
      can :publish_efcsn_article, Article
    end
  end
end
