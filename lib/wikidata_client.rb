# frozen_string_literal: true

module WikidataClient
  def self.search_for_speaker(speaker)
    client = Graphlient::Client.new("https://tools.wmflabs.org/tptools/wdql.php")

    name = speaker.first_name + " " + speaker.last_name

    # Where section taken from following SPARQL query:
    #
    #   SELECT ?item ?itemLabelCs ?itemPartyLabelCs
    #   WHERE
    #   {
    #     ?item wdt:P106 wd:Q82955.
    #     ?item wdt:P27 wd:Q213.
    #     ?item wdt:P102 ?itemParty.
    #     ?itemParty rdfs:label ?itemPartyLabelCs filter (lang(?itemPartyLabelCs) = "cs") .
    #     ?item rdfs:label ?itemLabelCs filter (lang(?itemLabelCs) = "cs") .
    #     FILTER (regex(str(?itemLabelCs), '^Miroslav Kalousek$')).
    #   }
    #
    sparql_query = "?entity wdt:P106 wd:Q82955. ?entity wdt:P27 wd:Q213. ?entity rdfs:label ?entityLabelCs filter (lang(?entityLabelCs) = 'cs') . FILTER (regex(str(?entityLabelCs), '^#{name}$'))."

    response = client.query <<~GRAPHQL
      query {
        findEntitiesWithSPARQL(where: "#{sparql_query}") {
          edges {
            node {
              type
              id
            }
          }
        }
      }
    GRAPHQL

    found_wikidata_ids = response.data.find_entities_with_sparql.edges.map { |edge| edge.node.id }

    found_wikidata_ids.uniq
  end

  def self.fetch_entity(wikidata_id)
    connection = Faraday.new "https://www.wikidata.org/wiki/Special:EntityData/" do |conn|
      conn.response :json, content_type: /\bjson$/
      conn.adapter Faraday.default_adapter
    end

    json_response = connection.get("#{wikidata_id}.json")
    json_response.body["entities"][wikidata_id]
  end
end
