# frozen_string_literal: true

module Schema::Speakers::SpeakerField
  extend ActiveSupport::Concern

  included do
    field :speaker, Types::SpeakerType, null: false do
      argument :id, GraphQL::Types::Int, required: true
    end

    def speaker(id:)
      Speaker.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find Speaker with id=#{id}")
    end
  end
end
