# frozen_string_literal: true

module Schema::Search::Resolvers
  class StatementSearchResultResolver < GraphQL::Schema::Resolver
    type Schema::Search::Types::SearchResultStatementType, null: false

    argument :term, GraphQL::Types::String, required: true
    argument :limit, GraphQL::Types::Int, required: false, default_value: 10
    argument :offset, GraphQL::Types::Int, required: false, default_value: 0
    argument :include_aggregations, GraphQL::Types::Boolean, required: false, default_value: false
    argument :filters, Schema::Search::Inputs::StatementFilterInput, required: false

    def resolve(term:, limit:, offset:, include_aggregations:, filters: nil)
      query = build_query(term, filters ? filters.to_hash : {})
      pagination = build_pagination(limit, offset)

      if include_aggregations
        search_with_aggregations(query, pagination)
      else
        search(query, pagination)
      end
    end

    private
      def search(query, pagination)
        statement_search = StatementsElasticQueryService.search_published_factual(query, **pagination)

        { statements: statement_search.records.to_a, total_count: statement_search.total_count }
      end

      def search_with_aggregations(query, pagination)
        statement_search, aggregations = StatementsElasticQueryService.search_with_aggregations(query, **pagination)

        tag_aggregation = aggregations.fetch("tag_id", {})

        tags = Tag.where(id: tag_aggregation.keys.select { |tag_id| tag_id != -1 }).map do |tag|
          { tag:, count: tag_aggregation[tag.id] }
        end.sort_by { |tag| [-tag[:count], tag[:tag][:name]] }

        veracity_key_aggregation = aggregations.fetch("veracity_key", {})

        veracities = Assessment::VERACITIES.each_with_index.map do |key, i|
          veracity = { id: i + 1, key:, name: I18n.t("veracity.names.#{key}") }
          { veracity:, count: veracity_key_aggregation.fetch(key, 0) }
        end

        released_year_aggregation = aggregations.fetch("released_year", {})

        years = released_year_aggregation.keys.map do |year|
          { year:, count: released_year_aggregation[year] }
        end.sort_by { |option| -option[:year] }

        { statements: statement_search.records.to_a, total_count: statement_search.total_count, tags:, veracities:, years: }
      end

      def build_query(term, filters)
        query = { query: term }

        filters[:tags]&.tap do |tags|
          query[:tag_id] = tags unless tags.empty?
        end

        filters[:veracities]&.tap do |veracities|
          query[:veracity_key] = veracities unless veracities.empty?
        end

        filters[:years]&.tap do |years|
          query[:released_year] = years unless years.empty?
        end

        query
      end

      def build_pagination(limit, offset)
        { from: offset, size: limit }
      end
  end
end
