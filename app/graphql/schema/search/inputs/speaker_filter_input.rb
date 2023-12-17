# frozen_string_literal: true

module Schema::Search::Inputs
  class SpeakerFilterInput < GraphQL::Schema::InputObject
    argument :bodies, [GraphQL::Types::ID], required: false
  end
end
