# frozen_string_literal: true

module Schema::Search::Resolvers
  class BaseSearchResultResolver < GraphQL::Schema::Resolver
    private
      def build_pagination(limit, offset)
        { from: offset, size: limit }
      end
  end
end
