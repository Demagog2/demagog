# frozen_string_literal: true

module Types
  class VeracityType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :key, Types::VeracityKeyType, null: false

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
