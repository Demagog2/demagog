import gql from 'graphql-tag';

export const CreateMediaPersonality = gql`
  mutation CreateMediaPersonality($mediaPersonalityInput: MediaPersonalityInput!) {
    createMediaPersonality(mediaPersonalityInput: $mediaPersonalityInput) {
      mediaPersonality {
        id
        name
      }
    }
  }
`;

export const UpdateMediaPersonality = gql`
  mutation UpdateMediaPersonality($id: ID!, $mediaPersonalityInput: MediaPersonalityInput!) {
    updateMediaPersonality(id: $id, mediaPersonalityInput: $mediaPersonalityInput) {
      mediaPersonality {
        id
        name
      }
    }
  }
`;

export const DeleteMediaPersonality = gql`
  mutation DeleteMediaPersonality($id: ID!) {
    deleteMediaPersonality(id: $id) {
      id
    }
  }
`;

export const CreateMedium = gql`
  mutation CreateMedium($mediumInput: MediumInput!) {
    createMedium(mediumInput: $mediumInput) {
      medium {
        id
        name
      }
    }
  }
`;

export const UpdateMedium = gql`
  mutation UpdateMedium($id: ID!, $mediumInput: MediumInput!) {
    updateMedium(id: $id, mediumInput: $mediumInput) {
      medium {
        id
        name
      }
    }
  }
`;

export const DeleteMedium = gql`
  mutation DeleteMedium($id: ID!) {
    deleteMedium(id: $id) {
      id
    }
  }
`;

export const CreatePage = gql`
  mutation CreatePage($pageInput: PageInput!) {
    createPage(pageInput: $pageInput) {
      page {
        id
        title
        slug
        published
        textHtml
        textSlatejson
      }
    }
  }
`;

export const UpdatePage = gql`
  mutation UpdatePage($id: ID!, $pageInput: PageInput!) {
    updatePage(id: $id, pageInput: $pageInput) {
      page {
        id
        title
        slug
        published
        textHtml
        textSlatejson
      }
    }
  }
`;

export const DeletePage = gql`
  mutation DeletePage($id: ID!) {
    deletePage(id: $id) {
      id
    }
  }
`;

export const CreateArticle = gql`
  mutation CreateArticle($articleInput: ArticleInput!) {
    createArticle(articleInput: $articleInput) {
      article {
        id
        articleType
        title
        slug
        perex
        published
        publishedAt
        illustration
        segments {
          id
          segmentType
          textHtml
          textSlatejson
          statements {
            id
          }
        }
        source {
          id
        }
      }
    }
  }
`;

export const UpdateArticle = gql`
  mutation UpdateArticle($id: ID!, $articleInput: ArticleInput!) {
    updateArticle(id: $id, articleInput: $articleInput) {
      article {
        id
        articleType
        title
        slug
        perex
        published
        publishedAt
        illustration
        segments {
          id
          segmentType
          textHtml
          textSlatejson
          statements {
            id
          }
        }
        source {
          id
        }
      }
    }
  }
`;

export const DeleteArticle = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id) {
      id
    }
  }
`;

export const CreateSource = gql`
  mutation CreateSource($sourceInput: SourceInput!) {
    createSource(sourceInput: $sourceInput) {
      source {
        id
        name
      }
    }
  }
`;

export const UpdateSource = gql`
  mutation UpdateSource($id: ID!, $sourceInput: SourceInput!) {
    updateSource(id: $id, sourceInput: $sourceInput) {
      source {
        id
        name
      }
    }
  }
`;

export const DeleteSource = gql`
  mutation DeleteSource($id: ID!) {
    deleteSource(id: $id) {
      id
    }
  }
`;

export const CreateBody = gql`
  mutation CreateBody($bodyInput: BodyInput!) {
    createBody(bodyInput: $bodyInput) {
      body {
        id
        logo
        name
        isParty
        isInactive
        shortName
        link
        foundedAt
        terminatedAt
      }
    }
  }
`;

export const UpdateBody = gql`
  mutation UpdateBody($id: Int!, $bodyInput: BodyInput!) {
    updateBody(id: $id, bodyInput: $bodyInput) {
      body {
        id
        logo
        name
        isParty
        isInactive
        shortName
        link
        foundedAt
        terminatedAt
      }
    }
  }
`;

export const DeleteBody = gql`
  mutation DeleteBody($id: ID!) {
    deleteBody(id: $id) {
      id
    }
  }
`;

export const CreateSpeaker = gql`
  mutation CreateSpeaker($speakerInput: SpeakerInput!) {
    createSpeaker(speakerInput: $speakerInput) {
      speaker {
        id
        firstName
        lastName
        avatar
        websiteUrl
        body {
          shortName
        }
        memberships {
          id
          body {
            id
            shortName
          }
          since
          until
        }
      }
    }
  }
`;

export const UpdateSpeaker = gql`
  mutation UpdateSpeaker($id: ID!, $speakerInput: SpeakerInput!) {
    updateSpeaker(id: $id, speakerInput: $speakerInput) {
      speaker {
        id
        firstName
        lastName
        avatar
        websiteUrl
        body {
          shortName
        }
        memberships {
          id
          body {
            id
            shortName
          }
          since
          until
        }
      }
    }
  }
`;

export const DeleteSpeaker = gql`
  mutation DeleteSpeaker($id: ID!) {
    deleteSpeaker(id: $id) {
      id
    }
  }
`;

export const CreateUser = gql`
  mutation CreateUser($userInput: UserInput!) {
    createUser(userInput: $userInput) {
      user {
        id
        firstName
        lastName
        email
        avatar
        active
        positionDescription
        bio
        emailNotifications
        userPublic
        role {
          id
          name
        }
      }
    }
  }
`;

export const UpdateUser = gql`
  mutation UpdateUser($id: Int!, $userInput: UserInput!) {
    updateUser(id: $id, userInput: $userInput) {
      user {
        id
        firstName
        lastName
        email
        avatar
        active
        positionDescription
        bio
        emailNotifications
        userPublic
        role {
          id
          name
        }
      }
    }
  }
`;

export const UpdateUserPublicity = gql`
  mutation UpdateUserPublicity($id: Int!, $userPublicity: Boolean!) {
    updateUserPublicity(id: $id, userPublic: $userPublicity) {
      user {
        id
        firstName
        lastName
        email
        avatar
        active
        positionDescription
        bio
        emailNotifications
        userPublic
        role {
          id
          name
        }
      }
    }
  }
`;

export const UpdateUsersRank = gql`
  mutation UpdateUsersRank($orderedUserIds: [ID!]!) {
    updateUsersRank(orderedUserIds: $orderedUserIds) {
      users {
        id
        rank
      }
    }
  }
`;

export const DeleteUser = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const CreateStatement = gql`
  mutation CreateStatement($statementInput: CreateStatementInput!) {
    createStatement(statementInput: $statementInput) {
      statement {
        id
        content
        excerptedAt
        important
        speaker {
          id
        }
        source {
          id
          statementsCountsByEvaluationStatus {
            evaluationStatus
            statementsCount
          }
        }
      }
    }
  }
`;

export const UpdateStatement = gql`
  mutation UpdateStatement($id: Int!, $statementInput: UpdateStatementInput!) {
    updateStatement(id: $id, statementInput: $statementInput) {
      statement {
        id
        content
        title
        important
        published
        excerptedAt
        speaker {
          id
          firstName
          lastName
          avatar
        }
        assessment {
          id
          shortExplanation
          explanationHtml
          explanationSlatejson
          evaluationStatus
          evaluator {
            id
            firstName
            lastName
          }
          veracity {
            id
            key
            name
          }
          promiseRating {
            id
            key
            name
          }
        }
        source {
          id
          statementsCountsByEvaluationStatus {
            evaluationStatus
            statementsCount
          }
        }
        commentsCount
      }
    }
  }
`;

export const DeleteStatement = gql`
  mutation DeleteStatement($id: ID!) {
    deleteStatement(id: $id) {
      id
    }
  }
`;

export const CreateComment = gql`
  mutation CreateComment($commentInput: CommentInput!) {
    createComment(commentInput: $commentInput) {
      comment {
        id
        content
        user {
          id
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`;

export const UpdateSourceStatementsOrder = gql`
  mutation UpdateSourceStatementsOrder($id: ID!, $input: UpdateSourceStatementsOrderInput!) {
    updateSourceStatementsOrder(id: $id, input: $input) {
      source {
        id
      }
    }
  }
`;

export const PublishApprovedSourceStatements = gql`
  mutation PublishApprovedSourceStatements($id: ID!) {
    publishApprovedSourceStatements(id: $id) {
      source {
        id
        statements {
          id
          published
        }
      }
    }
  }
`;

export const DeleteContentImage = gql`
  mutation DeleteContentImage($id: ID!) {
    deleteContentImage(id: $id) {
      id
    }
  }
`;

export const UpdateNotification = gql`
  mutation UpdateNotification($id: ID!, $input: UpdateNotificationInput!) {
    updateNotification(id: $id, input: $input) {
      notification {
        id
        readAt
      }
    }
  }
`;

export const MarkUnreadNotificationsAsRead = gql`
  mutation MarkUnreadNotificationsAsRead {
    markUnreadNotificationsAsRead {
      notifications {
        id
        readAt
      }
    }
  }
`;
