# frozen_string_literal: true

module Schema::Search::Resolvers
  class StatementSearchResultResolver < BaseSearchResultResolver
    type Schema::Search::Types::SearchResultStatementType, null: false

    class << self
      attr_accessor :model_context
    end

    argument :term, GraphQL::Types::String, required: true
    argument :limit, GraphQL::Types::Int, required: false, default_value: 10
    argument :offset, GraphQL::Types::Int, required: false, default_value: 0
    argument :include_aggregations, GraphQL::Types::Boolean, required: false, default_value: false
    argument :filters, Schema::Search::Inputs::StatementFilterInput, required: false

    def self.within_context(model_context)
      Class.new(self) do
        self.model_context = model_context
      end
    end

    def model_context
      case self.class.model_context
      when :speaker
        { speaker_id: object.id }
      else
        {}
      end
    end

    def resolve(term:, limit:, offset:, include_aggregations:, filters: nil)
      query = build_query(term, filters ? filters.to_hash : {})
      pagination = build_pagination(limit, offset)

      if include_aggregations
        search(query, pagination).merge(aggregations)
      else
        search(query, pagination)
      end
    end

    private
      def search(query, pagination)
        statement_search = StatementsElasticQueryService.search_published_factual(model_context.merge(query), **pagination)

        { statements: statement_search.records.to_a, total_count: statement_search.total_count }
      end

      def aggregations
        aggregations = StatementsElasticQueryService.aggregate_published_factual(model_context)

        {
          tags: tag_aggregations(aggregations),
          years: released_year_aggregations(aggregations),
          veracities: veracity_aggregations(aggregations),
          editor_picked: editor_picked_aggregation(aggregations)
        }
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

        filters[:editor_picked]&.tap do |editor_picked|
          query[:editor_picked] = true if editor_picked
        end

        query
      end

      def tag_aggregations(aggregations)
        tag_aggregation = aggregations.fetch("tag_id", {})

        tags = Tag.where(id: tag_aggregation.keys.select { |tag_id| tag_id != -1 }).map do |tag|
          { tag:, count: tag_aggregation[tag.id] }
        end

        tags.push({ tag: { id: -1, name: "Bez tématu" }, count: tag_aggregation[-1] }) if tag_aggregation.key?(-1)

        tags.sort_by { |tag| [-tag[:count], tag[:tag][:name]] }
      end

      def released_year_aggregations(aggregations)
        released_year_aggregation = aggregations.fetch("released_year", {})

        released_year_aggregation.keys.map do |year|
          { year:, count: released_year_aggregation[year] }
        end.sort_by { |option| -option[:year] }
      end

      def veracity_aggregations(aggregations)
        veracity_key_aggregation = aggregations.fetch("veracity_key", {})

        Assessment::VERACITIES.each_with_index.map do |key, i|
          veracity = { id: i + 1, key:, name: I18n.t("veracity.names.#{key}") }
          { veracity:, count: veracity_key_aggregation.fetch(key, 0) }
        end
      end

      def editor_picked_aggregation(aggregations)
        editor_picked_aggreations = aggregations.fetch("editor_picked", {})

        { count: editor_picked_aggreations.fetch(1, 0).to_int }
      end
  end
end
