# frozen_string_literal: true

class Errors::NotAuthorizedError < GraphQL::ExecutionError
  def initialize
    super("You are not authorized to access or change this")
  end
end
