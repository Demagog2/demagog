# frozen_string_literal: true

module Types
  class CommentInputType < GraphQL::Schema::InputObject
    argument :content, String, required: true
    argument :statement_id, ID, required: true
  end
end
