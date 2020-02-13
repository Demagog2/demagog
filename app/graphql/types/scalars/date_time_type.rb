# frozen_string_literal: true

module Types
  module Scalars
    class DateTimeType < GraphQL::Schema::Scalar
      def self.coerce_input(value, _ctx)
        Time.zone.parse(value)
      end

      def self.coerce_result(value, _ctx)
        value.utc.iso8601
      end
    end
  end
end
