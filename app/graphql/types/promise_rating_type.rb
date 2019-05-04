# frozen_string_literal: true

module Types
  class PromiseRatingType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :key, Types::PromiseRatingKeyType, null: false

    field :assessments, [Types::AssessmentType], null: false do
      argument :limit, Int, default_value: 10, required: false
      argument :offset, Int, default_value: 0, required: false
    end

    def assessments(args)
      object.assessments
        .where(assessments: { evaluation_status: Assessment::STATUS_APPROVED })
        .limit(args[:limit])
        .offset(args[:offset])
    end
  end
end
