# frozen_string_literal: true

class AssessmentAbility
  include CanCan::Ability

  EVALUATOR_ALLOWED_ATTRIBUTES = %i[
    veracity_new
    veracity_id
    promise_rating_id
    explanation_html
    explanation_slatejson
    short_explanation
    evaluation_status
  ].to_set.freeze

  def initialize(user)
    can :read, Assessment, evaluation_status: Assessment::STATUS_APPROVED

    return unless user.present?

    case user.role.key
    when Role::SOCIAL_MEDIA_MANAGER
      can :read, Assessment
    when Role::PROOFREADER
      can [:read, :update], Assessment
    when Role::ADMIN, Role::EXPERT
      can :manage, Assessment
    else
      can :read, Assessment, evaluator: user

      can :update, Assessment do |assessment, new_attributes|
        next unless assessment.evaluated_by?(user)

        changed_attributes = new_attributes.symbolize_keys.keys

        case assessment.evaluation_status
        when Assessment::STATUS_BEING_EVALUATED
          EVALUATOR_ALLOWED_ATTRIBUTES >= changed_attributes.to_set
        when Assessment::STATUS_APPROVAL_NEEDED
          changed_attributes == %i[evaluation_status]
        else
          false
        end
      end
    end
  end
end
