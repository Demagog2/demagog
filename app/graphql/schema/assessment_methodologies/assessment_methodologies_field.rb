# frozen_string_literal: true

module Schema::AssessmentMethodologies::AssessmentMethodologiesField
  extend ActiveSupport::Concern

  included do
    field :assessment_methodologies, [Types::AssessmentMethodologyType], null: false do
      argument :rating_model, Types::AssessmentMethodologyRatingModelType, required: false
    end

    def assessment_methodologies(rating_model: nil)
      if rating_model.present?
        AssessmentMethodology.where(rating_model:)
      else
        AssessmentMethodology.all
      end
    end
  end
end
