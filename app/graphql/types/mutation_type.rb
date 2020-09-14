# frozen_string_literal: true

module Types
  class MutationType < BaseObject
    field :createBody, mutation: Mutations::CreateBody
    field :updateBody, mutation: Mutations::UpdateBody
    field :deleteBody, mutation: Mutations::DeleteBody

    field :createSpeaker, mutation: Mutations::CreateSpeaker
    field :updateSpeaker, mutation: Mutations::UpdateSpeaker
    field :deleteSpeaker, mutation: Mutations::DeleteSpeaker

    field :createUser, mutation: Mutations::CreateUser
    field :updateUser, mutation: Mutations::UpdateUser
    field :deleteUser, mutation: Mutations::DeleteUser
    field :updateUserActiveness, mutation: Mutations::UpdateUserActiveness
    field :updateUsersRank, mutation: Mutations::UpdateUsersRank

    field :createMediaPersonality, mutation: Mutations::CreateMediaPersonality
    field :updateMediaPersonality, mutation: Mutations::UpdateMediaPersonality
    field :deleteMediaPersonality, mutation: Mutations::DeleteMediaPersonality

    field :createMedium, mutation: Mutations::CreateMedium
    field :updateMedium, mutation: Mutations::UpdateMedium
    field :deleteMedium, mutation: Mutations::DeleteMedium

    field :createSource, mutation: Mutations::CreateSource
    field :updateSource, mutation: Mutations::UpdateSource
    field :deleteSource, mutation: Mutations::DeleteSource
    field :updateSourceVideoFields, mutation: Mutations::UpdateSourceVideoFields

    field :createStatement, mutation: Mutations::CreateStatement
    field :updateStatement, mutation: Mutations::UpdateStatement
    field :deleteStatement, mutation: Mutations::DeleteStatement

    field :createArticle, mutation: Mutations::CreateArticle
    field :updateArticle, mutation: Mutations::UpdateArticle
    field :deleteArticle, mutation: Mutations::DeleteArticle

    field :createPage, mutation: Mutations::CreatePage
    field :updatePage, mutation: Mutations::UpdatePage
    field :deletePage, mutation: Mutations::DeletePage

    field :updateWebContent, mutation: Mutations::UpdateWebContent

    field :updateSourceStatementsOrder, mutation: Mutations::UpdateSourceStatementsOrder
    field :publishApprovedSourceStatements, mutation: Mutations::PublishApprovedSourceStatements
    field :updateStatementsVideoMarks, mutation: Mutations::UpdateStatementsVideoMarks

    field :createComment, mutation: Mutations::CreateComment

    field :deleteContentImage, mutation: Mutations::DeleteContentImage

    field :updateNotification, mutation: Mutations::UpdateNotification
    field :markUnreadNotificationsAsRead, mutation: Mutations::MarkUnreadNotificationsAsRead
  end
end
