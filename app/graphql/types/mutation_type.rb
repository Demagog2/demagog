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

  field :createMedium, Mutations::CreateMedium
  field :updateMedium, Mutations::UpdateMedium
  field :deleteMedium, Mutations::DeleteMedium

  field :createSource, Mutations::CreateSource
  field :updateSource, Mutations::UpdateSource
  field :deleteSource, Mutations::DeleteSource

  field :createStatement, Mutations::CreateStatement
  field :updateStatement, Mutations::UpdateStatement
  field :deleteStatement, Mutations::DeleteStatement

  field :createArticle, Mutations::CreateArticle
  field :updateArticle, Mutations::UpdateArticle
  field :deleteArticle, Mutations::DeleteArticle

  field :createPage, Mutations::CreatePage
  field :updatePage, Mutations::UpdatePage
  field :deletePage, Mutations::DeletePage

  field :updateSourceStatementsOrder, Mutations::UpdateSourceStatementsOrder

  field :createComment, Mutations::CreateComment

  field :deleteContentImage, Mutations::DeleteContentImage

  field :updateNotification, Mutations::UpdateNotification
end
