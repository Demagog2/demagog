# frozen_string_literal: true

module Schema::Articles::Types
  class GovernmentPromiseType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :content, String, null: false
    field :source, GovernmentPromiseSourceType, null: false

    def source
      { url: object.promise_source_url, label: object.promise_source_label }
    end
  end
end
