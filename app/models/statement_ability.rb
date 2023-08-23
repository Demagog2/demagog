# frozen_string_literal: true

class StatementAbility
  include CanCan::Ability

  def initialize(user)
    return unless user.present?

    can :update, Statement do |statement, new_attributes|
      next unless statement.evaluated_by?(user) && statement.being_evaluated?

      %i[content title tags].to_set >= new_attributes.symbolize_keys.keys.to_set
    end

    if user.role?(Role::EXPERT) || user.role?(Role::ADMIN) || user.role?(Role::PROOFREADER)
      can :update, Statement
    end
  end
end
