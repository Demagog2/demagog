# frozen_string_literal: true

module Schema::Sources::SourceField
  extend ActiveSupport::Concern

  included do
    field :source, Types::SourceType, null: false do
      argument :id, GraphQL::Types::Int, required: true
    end

    def source(id:)
      Source.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find Source with id=#{id}")
    end
  end
end
