# frozen_string_literal: true

Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createBody, !Types::BodyType do
    description "Add new body"

    argument :body_input, !Types::BodyInputType

    resolve -> (obj, args, ctx) {
      Body.create!(args[:body_input].to_h)
    }
  end

  field :updateBody, Types::BodyType do
    description "Update existing body"

    argument :id, !types.Int
    argument :body_input, !Types::BodyInputType

    resolve -> (obj, args, ctx) {
      Body.update(args[:id], args[:body_input].to_h)
    }
  end

  field :deleteBody, !types.Int do
    argument :id, !types.Int
    resolve -> (obj, args, ctx) {
      # Olol
      begin
        Body.destroy(args[:id].to_i)
        202
      rescue
        202
      end
    }
  end

  field :createSpeaker, Types::SpeakerType do
    description "Add new speaker"

    argument :speaker_input, !Types::SpeakerInputType

    resolve -> (obj, args, ctx) {
      speaker = args[:speaker_input].to_h

      speaker["memberships"] = speaker["memberships"].map do |mem|
        Membership.new(body: Body.find(mem["body_id"]), since: mem["since"], until: mem["until"])
      end

      Speaker.create!(speaker)
    }
  end

  field :updateSpeaker, Types::SpeakerType do
    description "Update existing speaker"

    argument :id, !types.Int
    argument :speaker_input, !Types::SpeakerInputType

    resolve -> (obj, args, ctx) {
      speaker = args[:speaker_input].to_h

      speaker["memberships"] = speaker["memberships"].map do |mem|
        membership = mem["id"] ? Membership.find(mem["id"]) : Membership.new()

        membership.assign_attributes(
          body: Body.find(mem["body_id"]),
          since: mem["since"],
          until: mem["until"]
        )

        membership
      end

      Speaker.transaction do
        speaker["memberships"].each do |mem|
          mem.save
        end

        Speaker.update(args[:id], speaker)
      end
    }
  end
end
