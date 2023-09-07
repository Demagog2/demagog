# frozen_string_literal: true

class Ability
  attr_reader :combined_ability

  delegate :can?, :cannot?, :authorize!, to: :combined_ability

  def initialize(user)
    @combined_ability = AssessmentAbility.new(user).merge(ArticleTagAbility.new(user))
  end
end
