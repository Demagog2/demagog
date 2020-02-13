# frozen_string_literal: true

require "json"

module Types
  module Scalars
    class JsonType < GraphQL::Schema::Scalar
      def self.coerce_input(value, ctx)
        value.to_h.to_json
      end

      def self.coerse_result(value, ctx)
        JSON.parse(value)
      end
    end
  end
end
