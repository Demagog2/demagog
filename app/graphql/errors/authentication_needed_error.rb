# frozen_string_literal: true

class Errors::AuthenticationNeededError < GraphQL::ExecutionError
  def initialize
    super("You must be logged in to be able to access this")
  end
end
