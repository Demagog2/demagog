# frozen_string_literal: true

module Schema::Speakers::DataLoaders
  class Body < GraphQL::Dataloader::Source
    def fetch(speaker_ids)
      membership_index = Membership
        .where(speaker_id: speaker_ids, until: nil)
        .pluck(:speaker_id, :body_id)
        .to_h

      body_index = ::Body.where(id: membership_index.values).index_by(&:id)

      speaker_ids.map do |speaker_id|
        body_id = membership_index[speaker_id]
        body_index[body_id]
      end
    end
  end
end
