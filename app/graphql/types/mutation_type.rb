# frozen_string_literal: true

module Types
  class MutationType < BaseObject
    # field :createBody, Mutations::CreateBody
    # field :updateBody, Mutations::UpdateBody
    # field :deleteBody, Mutations::DeleteBody
    #
    # field :createSpeaker, Mutations::CreateSpeaker
    # field :updateSpeaker, Mutations::UpdateSpeaker
    # field :deleteSpeaker, field: Mutations::DeleteSpeaker

    # field :createUser, Mutations::CreateUser
    # field :updateUser, Mutations::UpdateUser
    # field :updateUserPublicity, Mutations::UpdateUserPublicity
    # field :updateUsersRank, Mutations::UpdateUsersRank
    field :deleteUser, field: Mutations::DeleteUser
    #
    # field :createMediaPersonality, Mutations::CreateMediaPersonality
    # field :updateMediaPersonality, Mutations::UpdateMediaPersonality
    # field :deleteMediaPersonality, Mutations::DeleteMediaPersonality
    #
    # field :createMedium, Mutations::CreateMedium
    # field :updateMedium, Mutations::UpdateMedium
    # field :deleteMedium, Mutations::DeleteMedium
    #
    # field :createSource, Mutations::CreateSource
    # field :updateSource, Mutations::UpdateSource
    # field :deleteSource, Mutations::DeleteSource
    #
    # field :createStatement, Mutations::CreateStatement
    # field :updateStatement, Mutations::UpdateStatement
    # field :deleteStatement, Mutations::DeleteStatement
    #
    # field :createArticle, Mutations::CreateArticle
    # field :updateArticle, Mutations::UpdateArticle
    # field :deleteArticle, Mutations::DeleteArticle
    #
    # field :createPage, Mutations::CreatePage
    # field :updatePage, Mutations::UpdatePage
    # field :deletePage, Mutations::DeletePage
    #
    # field :updateSourceStatementsOrder, Mutations::UpdateSourceStatementsOrder
    # field :publishApprovedSourceStatements, Mutations::PublishApprovedSourceStatements
    #
    # field :createComment, Mutations::CreateComment
    #
    # field :deleteContentImage, Mutations::DeleteContentImage
    #
    # field :updateNotification, Mutations::UpdateNotification
    # field :markUnreadNotificationsAsRead, Mutations::MarkUnreadNotificationsAsRead
  end
end
