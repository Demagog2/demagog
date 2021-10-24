# frozen_string_literal: true

class SpeakersElasticQueryService
  def self.search_all(filters)
    Speaker.search(
      query: build_all_elastic_query(filters),
      sort: [
        { sort_name: { order: "asc" } }
      ]
    )
  end

  def self.aggregate_all(filters)
    # Elastic defaults only to 10
    aggregation_size = 10000

    response = Speaker.search(
      # We want only aggregations, no actual results
      size: 0,
      from: 0,
      query: build_all_elastic_query(filters),
      aggs: {
        body_id: { terms: { field: "body.id", size: aggregation_size, missing: -1 } },
      }
    )

    aggregations = {}

    response.aggregations.keys.each do |aggregation_key|
      aggregations[aggregation_key] = {}

      response.aggregations[aggregation_key].buckets.each do |bucket|
        aggregations[aggregation_key][bucket["key"]] = bucket["doc_count"]
      end
    end

    aggregations
  end

  private
    def self.build_all_elastic_query(filters)
      elastic_query = {
        bool: {
          filter: [
            { range: { factual_and_published_statements_count: { gt: 0 } } }
          ]
        }
      }

      query = filters.fetch(:query, nil)
      unless query.blank?
        elastic_query[:bool][:must] = { simple_query_string: Statement.simple_query_string_defaults.merge(query: query) }
      end

      body_id = filters.fetch(:body_id, nil)
      unless body_id.blank?
        elastic_query[:bool][:filter].push({ term: { 'body.id': body_id } })
      end

      not_speaker_ids = filters.fetch(:not_speaker_ids, [])
      unless not_speaker_ids.blank?
        elastic_query[:bool][:filter].push({
          bool: {
            must_not: { terms: { id: not_speaker_ids } }
          }
        })
      end

      elastic_query
    end
end
