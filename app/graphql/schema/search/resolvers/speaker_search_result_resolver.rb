# frozen_string_literal: true

module Schema::Search::Resolvers
  class SpeakerSearchResultResolver < BaseSearchResultResolver
    type Schema::Search::Types::SearchResultSpeakerType, null: false

    argument :term, GraphQL::Types::String, required: true
    argument :limit, GraphQL::Types::Int, required: false, default_value: 10
    argument :offset, GraphQL::Types::Int, required: false, default_value: 0
    argument :include_aggregations, GraphQL::Types::Boolean, required: false, default_value: false
    argument :filters, Schema::Search::Inputs::SpeakerFilterInput, required: false

    def resolve(term:, limit:, offset:, include_aggregations:, filters: nil)
      filters = filters ? filters.to_hash : {}
      query = build_query(term, filters)
      pagination = build_pagination(limit, offset)

      if include_aggregations
        search(query, pagination).merge(aggregations(filters))
      else
        search(query, pagination)
      end
    end

    private
      def search(query, pagination)
        speaker_search = SpeakersElasticQueryService.search_all(query.merge(pagination))

        { speakers: speaker_search.records.to_a, total_count: speaker_search.total_count }
      end

      def build_query(term, filters)
        query = {}

        query[:query] = term unless term.blank?

        filters[:bodies]&.tap do |bodies|
          query[:body_id] = bodies unless bodies.empty?
        end

        query[:not_speaker_ids] = Speaker::MOST_IMPORTANT_SPEAKER_IDS if query.empty?

        query
      end

      def aggregations(filters)
        aggregations = SpeakersElasticQueryService.aggregate_all({})

        {
          body_groups: body_groups(aggregations, filters),
        }
      end

      def body_groups(aggregations, filters)
        body_id_aggregation = aggregations.fetch("body_id", {})
        lower_parliament_body_ids = Body.get_lower_parliament_body_ids

        aggregated_bodies = Body.where(id: body_id_aggregation.keys).order(Arel.sql("name COLLATE \"cs_CZ\" ASC")).map do |body|
          {
            body:,
            count: body_id_aggregation[body.id],
            group_name: lower_parliament_body_ids.include?(body.id) ? I18n.t("aggregations.body_groups.parliamentary") : I18n.t("aggregations.body_groups.others"),
            is_selected: filters.fetch(:bodies, []).include?(body.id.to_s)
          }
        end

        [
          I18n.t("aggregations.body_groups.parliamentary"),
          I18n.t("aggregations.body_groups.others"),
        ].map do |name|
          {
            name:,
            bodies: aggregated_bodies.select { |body| body[:group_name] == name }
          }
        end
      end
  end
end
