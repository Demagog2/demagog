# frozen_string_literal: true

module Schema::Media::MediaPersonalityField
  extend ActiveSupport::Concern

  included do
    field :media_personality, Types::MediaPersonalityType, null: false do
      argument :id, GraphQL::Types::ID, required: true
    end

    def media_personality(id:)
      MediaPersonality.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find MediaPersonality with id=#{id}")
    end
  end
end
