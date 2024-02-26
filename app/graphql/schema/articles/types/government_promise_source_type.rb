# frozen_string_literal: true

module Schema::Articles::Types
  class GovernmentPromiseSourceType < Types::BaseObject
    field :url, String, null: true
    field :label, String, null: true
  end
end
