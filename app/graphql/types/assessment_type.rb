# frozen_string_literal: true

module Types
  class AssessmentType < BaseObject
    field :id, ID, null: false
    field :evaluation_status, String, null: false
    field :statement, Types::StatementType, null: false
    field :short_explanation_characters_length, Int, null: false
    field :explanation_characters_length, Int, null: false
    field :assessment_methodology, Types::AssessmentMethodologyType, null: false

    field :evaluator, Types::UserType, null: true

    def evaluator
      # Public cannot see who is the evaluator
      Utils::Auth.authenticate(context)

      object.evaluator
    end

    field :veracity, Types::VeracityType, null: true

    def veracity
      if AssessmentAbility.new(context[:current_user]).cannot?(:read, object)
        return nil
      end

      object.veracity
    end

    field :promise_rating, Types::PromiseRatingType, null: true

    def promise_rating
      if AssessmentAbility.new(context[:current_user]).cannot?(:read, object)
        return nil
      end

      object.promise_rating
    end

    field :short_explanation, String, null: true

    def short_explanation
      if AssessmentAbility.new(context[:current_user]).cannot?(:read, object)
        return nil
      end

      object.short_explanation
    end

    field :explanation_html, String, null: true

    def explanation_html
      if AssessmentAbility.new(context[:current_user]).cannot?(:read, object)
        return nil
      end

      object.explanation_html
    end

    field :explanation_slatejson, Types::Scalars::JsonType, null: true

    def explanation_slatejson
      if AssessmentAbility.new(context[:current_user]).cannot?(:read, object)
        return nil
      end

      object.explanation_slatejson
    end

    field :explanation, String, null: true do
      description "Alias for explanation_html"
    end

    def explanation
      object.explanation_html
    end
  end
end
