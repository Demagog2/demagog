# frozen_string_literal: true

module Schema::Speakers::SpeakersField
  extend ActiveSupport::Concern

  included do
    field :get_most_searched_speakers, [Types::SpeakerType], null: false

    field :speakers, [Types::SpeakerType], null: false do
      argument :limit, GraphQL::Types::Int, required: false, default_value: 10
      argument :offset, GraphQL::Types::Int, required: false, default_value: 0
      argument :party, GraphQL::Types::Int, required: false
      argument :body, GraphQL::Types::Int, required: false
      argument :name, GraphQL::Types::String, required: false
      argument :osoba_id,
               GraphQL::Types::String,
               required: false,
               description: "Temporary IDs from Hlidac statu, please use Wikidata ID instead"
      argument :wikidata_id, GraphQL::Types::String, required: false
    end

    def speakers(offset:, limit:, party: nil, body: nil, name: nil, osoba_id: nil, wikidata_id: nil)
      speakers = Speaker.offset(offset).limit(limit).order(last_name: :asc)

      body = party || body
      speakers = speakers.active_body_members(body) if body.present?

      speakers = speakers.matching_name(name) if name.present?

      speakers = speakers.where(osoba_id:) if osoba_id.present?

      speakers = speakers.where(wikidata_id:) if wikidata_id.present?

      speakers
    end

    def get_most_searched_speakers
      Speaker.where(id: Speaker.get_most_searched_speaker_ids)
    end
  end
end
