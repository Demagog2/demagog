# frozen_string_literal: true

module Types
  class StatementTranscriptPositionInputType < GraphQL::Schema::InputObject
    argument :start_line, Int, required: true
    argument :start_offset, Int, required: true
    argument :end_line, Int, required: true
    argument :end_offset, Int, required: true
  end
end
