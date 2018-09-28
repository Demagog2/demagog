import gql from 'graphql-tag';

export const CreateMedium = gql`
  mutation CreateMedium($mediumInput: MediumInputType!) {
    createMedium(medium_input: $mediumInput) {
      id
      name
      personalities {
        name
      }
    }
  }
`;

export const UpdateMedium = gql`
  mutation UpdateMedium($id: ID!, $mediumInput: MediumInputType!) {
    updateMedium(id: $id, medium_input: $mediumInput) {
      id
      name
      personalities {
        name
      }
    }
  }
`;

export const DeleteMedium = gql`
  mutation DeleteMedium($id: ID!) {
    deleteMedium(id: $id)
  }
`;

export const CreatePage = gql`
  mutation CreatePage($pageInput: PageInputType!) {
    createPage(page_input: $pageInput) {
      id
      title
      slug
      published
      text_html
      text_slatejson
    }
  }
`;

export const UpdatePage = gql`
  mutation UpdatePage($id: ID!, $pageInput: PageInputType!) {
    updatePage(id: $id, page_input: $pageInput) {
      id
      title
      slug
      published
      text_html
      text_slatejson
    }
  }
`;

export const DeletePage = gql`
  mutation DeletePage($id: ID!) {
    deletePage(id: $id)
  }
`;

export const CreateArticle = gql`
  mutation CreateArticle($articleInput: ArticleInputType!) {
    createArticle(article_input: $articleInput) {
      id
      article_type
      title
      slug
      perex
      published
      published_at
      illustration
      segments {
        id
        segment_type
        text_html
        text_slatejson
        statements {
          id
        }
      }
      source {
        id
      }
    }
  }
`;

export const UpdateArticle = gql`
  mutation UpdateArticle($id: ID!, $articleInput: ArticleInputType!) {
    updateArticle(id: $id, article_input: $articleInput) {
      id
      article_type
      title
      slug
      perex
      published
      published_at
      illustration
      segments {
        id
        segment_type
        text_html
        text_slatejson
        statements {
          id
        }
      }
      source {
        id
      }
    }
  }
`;

export const DeleteArticle = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;

export const CreateSource = gql`
  mutation CreateSource($sourceInput: SourceInputType!) {
    createSource(source_input: $sourceInput) {
      id
      name
    }
  }
`;

export const UpdateSource = gql`
  mutation UpdateSource($id: Int!, $sourceInput: SourceInputType!) {
    updateSource(id: $id, source_input: $sourceInput) {
      id
      name
    }
  }
`;

export const DeleteSource = gql`
  mutation DeleteSource($id: ID!) {
    deleteSource(id: $id)
  }
`;

export const CreateBody = gql`
  mutation CreateBody($bodyInput: BodyInputType!) {
    createBody(body_input: $bodyInput) {
      id
      logo
      name
      is_party
      is_inactive
      short_name
      link
      founded_at
      terminated_at
    }
  }
`;

export const UpdateBody = gql`
  mutation UpdateBody($id: Int!, $bodyInput: BodyInputType!) {
    updateBody(id: $id, body_input: $bodyInput) {
      id
      logo
      name
      is_party
      is_inactive
      short_name
      link
      founded_at
      terminated_at
    }
  }
`;

export const DeleteBody = gql`
  mutation DeleteBody($id: ID!) {
    deleteBody(id: $id)
  }
`;

export const CreateSpeaker = gql`
  mutation CreateSpeaker($speakerInput: SpeakerInputType!) {
    createSpeaker(speaker_input: $speakerInput) {
      id
      first_name
      last_name
      avatar
      website_url
      body {
        short_name
      }
      memberships {
        id
        body {
          id
          short_name
        }
        since
        until
      }
    }
  }
`;

export const UpdateSpeaker = gql`
  mutation UpdateSpeaker($id: Int!, $speakerInput: SpeakerInputType!) {
    updateSpeaker(id: $id, speaker_input: $speakerInput) {
      id
      first_name
      last_name
      avatar
      website_url
      body {
        short_name
      }
      memberships {
        id
        body {
          id
          short_name
        }
        since
        until
      }
    }
  }
`;

export const DeleteSpeaker = gql`
  mutation DeleteSpeaker($id: ID!) {
    deleteSpeaker(id: $id)
  }
`;

export const CreateUser = gql`
  mutation CreateUser($userInput: UserInputType!) {
    createUser(user_input: $userInput) {
      id
      first_name
      last_name
      email
      avatar
      active
      position_description
      bio
      email_notifications
      user_public
      role {
        id
        name
      }
    }
  }
`;

export const UpdateUser = gql`
  mutation UpdateUser($id: Int!, $userInput: UserInputType!) {
    updateUser(id: $id, user_input: $userInput) {
      id
      first_name
      last_name
      email
      avatar
      active
      position_description
      bio
      email_notifications
      user_public
      role {
        id
        name
      }
    }
  }
`;

export const UpdateUserPublicity = gql`
  mutation UpdateUserPublicity($id: Int!, $userPublicity: Boolean!) {
    updateUserPublicity(id: $id, user_public: $userPublicity) {
      id
      first_name
      last_name
      email
      avatar
      active
      position_description
      bio
      email_notifications
      user_public
      role {
        id
        name
      }
    }
  }
`;

export const UpdateUsersRank = gql`
  mutation UpdateUsersRank($input: UpdateUsersRankInputType!) {
    updateUsersRank(input: $input) {
      id
      rank
    }
  }
`;

export const DeleteUser = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const CreateStatement = gql`
  mutation CreateStatement($statementInput: CreateStatementInputType!) {
    createStatement(statement_input: $statementInput) {
      id
      content
      excerpted_at
      important
      speaker {
        id
      }
    }
  }
`;

export const UpdateStatement = gql`
  mutation UpdateStatement($id: Int!, $statementInput: UpdateStatementInputType!) {
    updateStatement(id: $id, statement_input: $statementInput) {
      id
      content
      important
      published
      excerpted_at
      speaker {
        id
        first_name
        last_name
        avatar
      }
      assessment {
        id
        short_explanation
        explanation_html
        explanation_slatejson
        evaluation_status
        evaluator {
          id
          first_name
          last_name
        }
        veracity {
          id
          key
          name
        }
      }
      comments_count
    }
  }
`;

export const DeleteStatement = gql`
  mutation DeleteStatement($id: ID!) {
    deleteStatement(id: $id)
  }
`;

export const CreateComment = gql`
  mutation CreateComment($commentInput: CommentInputType!) {
    createComment(comment_input: $commentInput) {
      id
      content
      user {
        id
        first_name
        last_name
      }
      created_at
    }
  }
`;

export const UpdateSourceStatementsOrder = gql`
  mutation UpdateSourceStatementsOrder($id: ID!, $input: UpdateSourceStatementsOrderInputType!) {
    updateSourceStatementsOrder(id: $id, input: $input) {
      id
    }
  }
`;

export const PublishApprovedSourceStatements = gql`
  mutation PublishApprovedSourceStatements($id: ID!) {
    publishApprovedSourceStatements(id: $id) {
      id
      statements {
        id
        published
      }
    }
  }
`;

export const DeleteContentImage = gql`
  mutation DeleteContentImage($id: ID!) {
    deleteContentImage(id: $id)
  }
`;

export const UpdateNotification = gql`
  mutation UpdateNotification($id: ID!, $input: UpdateNotificationInputType!) {
    updateNotification(id: $id, input: $input) {
      id
      read_at
    }
  }
`;

export const MarkUnreadNotificationsAsRead = gql`
  mutation MarkUnreadNotificationsAsRead {
    markUnreadNotificationsAsRead {
      id
      read_at
    }
  }
`;
