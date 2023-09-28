# frozen_string_literal: true

class Mutations::BaseMutation < GraphQL::Schema::Mutation
  def authorize!(action, model)
    Ability.new(context[:current_user]).authorize!(action, model)
  end
end
