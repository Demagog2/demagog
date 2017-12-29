# frozen_string_literal: true

Types::StatsType = GraphQL::ObjectType.define do
  name "Stats"

  field :true, types.Int do
    resolve ->(obj, args, ctx) {
      obj[:true]
    }
  end

  field :untrue, types.Int do
    resolve ->(obj, args, ctx) {
      obj[:untrue]
    }
  end


  field :misleading, types.Int do
    resolve ->(obj, args, ctx) {
      obj[:misleading]
    }
  end

  field :unverifiable, types.Int do
    resolve ->(obj, args, ctx) {
      obj[:unverifiable]
    }
  end
end
