# frozen_string_literal: true

Types::VeracityType = GraphQL::ObjectType.define do
  name "Veracity"

  field :id, !types.ID
  field :name, !types.String
  field :key, !Types::VeracityKeyType

  field :assessments, !types[Types::AssessmentType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0

    resolve ->(obj, args, ctx) {
      obj.assessments
        .where(assessments: { evaluation_status: Assessment::STATUS_APPROVED })
        .limit(args[:limit])
        .offset(args[:offset])
    }
  end
end
