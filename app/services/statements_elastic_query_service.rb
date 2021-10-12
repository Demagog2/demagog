# frozen_string_literal: true

class StatementsElasticQueryService
  def self.search_published_factual(filters)
    Statement.search(
      query: build_published_factual_elastic_query(filters),
      sort: [
        { 'source.released_at': { order: "desc" } }
      ],
      # Important as we have more than 10k statements (10k is the default size of elastic result window)
      track_total_hits: true
    )
  end

  def self.aggregate_published_factual(filters)
    # Elastic defaults only to 10
    aggregation_size = 10000

    response = Statement.search(
      # We want only aggregations, no actual results
      size: 0,
      from: 0,
      query: build_published_factual_elastic_query(filters),
      aggs: {
        body_id: { terms: { field: "source_speaker.body.id", size: aggregation_size, missing: -1 } },
        speaker_id: { terms: { field: "source_speaker.speaker.id", size: aggregation_size, missing: -1 } },
        tag_id: { terms: { field: "tags.id", size: aggregation_size, missing: -1 } },
        veracity_key: { terms: { field: "assessment.veracity.key", size: aggregation_size } },
        released_year: { terms: { field: "source.released_year", size: aggregation_size } },
        editor_picked: { terms: { field: "important", size: aggregation_size } }
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
    def self.build_published_factual_elastic_query(filters)
      elastic_query = {
        bool: {
          filter: [
            { term: { published: true } },
            { term: { statement_type: Statement::TYPE_FACTUAL } }
          ]
        }
      }

      query = filters.fetch(:query, nil)
      unless query.blank?
        elastic_query[:bool][:must] = { simple_query_string: Statement.simple_query_string_defaults.merge(query: query) }
      end

      body_id = filters.fetch(:body_id, nil)
      unless body_id.blank?
        elastic_query[:bool][:filter].push({ term: { 'source_speaker.body.id': body_id } })
      end

      speaker_id = filters.fetch(:speaker_id, nil)
      unless speaker_id.blank?
        elastic_query[:bool][:filter].push({ term: { 'source_speaker.speaker.id': speaker_id } })
      end

      tag_id = filters.fetch(:tag_id, nil)
      if !tag_id.blank?
        if tag_id.to_i > 0
          elastic_query[:bool][:filter].push({ term: { 'tags.id': tag_id } })
        end
        if tag_id.to_i == -1
          elastic_query[:bool][:filter].push({
            bool: {
              must_not: { exists: { field: "tags" } }
            }
          })
        end
      end

      veracity_key = filters.fetch(:veracity_key, nil)
      unless veracity_key.blank?
        elastic_query[:bool][:filter].push({ term: { 'assessment.veracity.key': veracity_key } })
      end

      editor_picked = filters.fetch(:editor_picked, nil)
      unless editor_picked.blank?
        elastic_query[:bool][:filter].push({ term: { 'important': editor_picked } })
      end

      released_year = filters.fetch(:released_year, nil)
      unless released_year.blank?
        elastic_query[:bool][:filter].push({ term: { 'source.released_year': released_year } })
      end

      elastic_query
    end
end
