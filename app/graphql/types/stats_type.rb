# frozen_string_literal: true

module Types
  class StatsType < BaseObject
    field :true, Int, null: true, resolver_method: :resolve_true
    field :untrue, Int, null: true
    field :misleading, Int, null: true
    field :unverifiable, Int, null: true

    def resolve_true
      object[:true]
    end

    def untrue
      object[:untrue]
    end

    def misleading
      object[:misleading]
    end

    def unverifiable
      object[:unverifiable]
    end
  end
end
