# frozen_string_literal: true

module Schema::Search::Resolvers
  class SpeakerSearchResultResolver < BaseSearchResultResolver
    type Schema::Search::Types::SearchResultSpeakerType, null: false

    argument :term, GraphQL::Types::String, required: true
    argument :limit, GraphQL::Types::Int, required: false, default_value: 10
    argument :offset, GraphQL::Types::Int, required: false, default_value: 0
    argument :include_aggregations, GraphQL::Types::Boolean, required: false, default_value: false

    def resolve(term:, limit:, offset:, include_aggregations:, filters: nil)
      pagination = build_pagination(limit, offset)

      if include_aggregations
        search(term, pagination).merge(aggregations)
      else
        search(term, pagination)
      end
    end

    private
      def search(term, pagination)
        speaker_search = Speaker.query_search(term, **pagination)

        { speakers: speaker_search.records.to_a, total_count: speaker_search.total_count }
      end

      def aggregations
        aggregations = SpeakersElasticQueryService.aggregate_all({})

        {
          body_groups: body_groups(aggregations),
        }
      end

      def body_groups(aggregations)
        body_id_aggregation = aggregations.fetch("body_id", {})
        lower_parliament_body_ids = Body.get_lower_parliament_body_ids

        body_id_filter_options = Body.where(id: body_id_aggregation.keys).order(Arel.sql("name COLLATE \"cs_CZ\" ASC")).map do |body|
          {
            body:,
            label: "#{body.name}" + (body.name != body.short_name ? " (#{body.short_name})" : ""),
            count: body_id_aggregation[body.id],
            group_name: lower_parliament_body_ids.include?(body.id) ? I18n.t("aggregations.body_groups.parliamentary") : I18n.t("aggregations.body_groups.others")
          }
        end

        [
          I18n.t("aggregations.body_groups.parliamentary"),
          I18n.t("aggregations.body_groups.others"),
        ].map do |name|
          {
            name:,
            bodies: body_id_filter_options.select { |body| body[:group_name] == name }
          }
        end
      end
  end
end
