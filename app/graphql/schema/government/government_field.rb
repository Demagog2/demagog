# frozen_string_literal: true

module Schema::Government::GovernmentField
  extend ActiveSupport::Concern

  included do
    field :government, Types::GovernmentType, null: true do
      argument :id, GraphQL::Types::Int, required: true
    end

    def government(args)
      Government.find(args[:id])
    end
  end
end
