# frozen_string_literal: true

Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createBody, Mutations::CreateBody
  field :updateBody, Mutations::UpdateBody
  field :deleteBody, Mutations::DeleteBody

  field :createSpeaker, Mutations::CreateSpeaker
  field :updateSpeaker, Mutations::UpdateSpeaker
  field :deleteSpeaker, Mutations::DeleteSpeaker

  field :createUser, Mutations::CreateUser
  field :updateUser, Mutations::UpdateUser
  field :deleteUser, Mutations::DeleteUser
end
