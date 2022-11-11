# frozen_string_literal: true

module Schema::Media::MediumField
  extend ActiveSupport::Concern

  included do
    field :medium, Types::MediumType, null: false do
      argument :id, GraphQL::Types::ID, required: true
    end

    def medium(id:)
      Medium.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find Medium with id=#{id}")
    end
  end
end
