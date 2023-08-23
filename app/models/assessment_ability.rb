# frozen_string_literal: true

require "set"

class AssessmentAbility
  include CanCan::Ability

  EVALUATOR_ALLOWED_ATTRIBUTES = Set.new(%i[
    veracity_new
    veracity_id
    promise_rating_id
    explanation_html
    explanation_slatejson
    short_explanation
    evaluation_status
  ]).freeze

  PROOFREADER_ALLOWED_ATTRIBUTES = Set.new(%i[
    explanation_html
    explanation_slatejson
    short_explanation
    evaluation_status
  ]).freeze

  def initialize(user)
    unless user.present?
      return can :read, Assessment, evaluation_status: Assessment::STATUS_APPROVED
    end

    if user.role? Role::SOCIAL_MEDIA_MANAGER
      can :read, Assessment
    end

    if user.role? Role::INTERN
      can :read, Assessment, evaluator: user

      can :update, Assessment do |assessment, new_attributes|
        next unless assessment.evaluated_by?(user)

        case assessment.evaluation_status
        when Assessment::STATUS_BEING_EVALUATED
          EVALUATOR_ALLOWED_ATTRIBUTES >= Set.new(new_attributes.keys)
        when Assessment::STATUS_APPROVAL_NEEDED
          new_attributes.keys == %i[evaluation_status]
        else
          false
        end
      end
    end

    if user.role? Role::PROOFREADER
      can :read, Assessment

      can :update, Assessment do |assessment, new_attributes|
        case assessment.evaluation_status
        when Assessment::STATUS_APPROVED
          false
        else
          PROOFREADER_ALLOWED_ATTRIBUTES >= Set.new(new_attributes.keys)
        end
      end
    end

    return unless user.role?(Role::ADMIN) || user.role?(Role::EXPERT)

    can :manage, Assessment
  end
end
