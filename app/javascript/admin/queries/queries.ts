import gql from 'graphql-tag';

export const PublishEfcsnArticleFragment = gql`
  fragment PublishEfcsnArticle on Article {
    id
    efcsnExternalId
    efcsnCreatedAt
  }
`;

export const GetPages = gql`
  query GetPages($title: String, $offset: Int, $limit: Int) {
    pages(includeUnpublished: true, offset: $offset, limit: $limit, title: $title) {
      id
      title
      slug
      published
    }
  }
`;

export const GetPage = gql`
  query GetPage($id: ID!) {
    page(id: $id, includeUnpublished: true) {
      id
      title
      slug
      published
      textHtml
      textSlatejson
    }
  }
`;

export const GetArticle = gql`
  query GetArticle($id: ID!) {
    article(id: $id, includeUnpublished: true) {
      ...PublishEfcsnArticle
      id
      articleType
      title
      titleEn
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
        promiseUrl
        statementId
        source {
          id
        }
      }
      source {
        id
      }
      articleTags {
        id
        title
      }
      assessmentMethodology {
        id
      }
    }
  }
  ${PublishEfcsnArticleFragment}
`;

export const GetArticles = gql`
  query GetArticles($title: String, $offset: Int, $limit: Int) {
    articles(includeUnpublished: true, offset: $offset, limit: $limit, title: $title) {
      id
      articleType
      title
      titleEn
      slug
      published
      publishedAt
    }
  }
`;

export const GetMediaPersonalities = gql`
  query GetMediaPersonalities($name: String) {
    mediaPersonalities(name: $name) {
      id
      name
    }
  }
`;

export const GetMediaPersonality = gql`
  query GetMediaPersonality($id: ID!) {
    mediaPersonality(id: $id) {
      id
      name
    }
  }
`;

export const GetMedia = gql`
  query GetMedia($name: String) {
    media(name: $name) {
      id
      name
    }
  }
`;

export const GetMedium = gql`
  query GetMedium($id: ID!) {
    medium(id: $id) {
      id
      name
    }
  }
`;

export const GetSources = gql`
  query GetSources($name: String, $offset: Int, $limit: Int) {
    sources(
      name: $name
      offset: $offset
      limit: $limit
      includeOnesWithoutPublishedStatements: true
    ) {
      id
      name
      sourceUrl
      releasedAt
      medium {
        id
        name
      }
      mediaPersonalities {
        id
        name
      }
      statementsCountsByEvaluationStatus {
        evaluationStatus
        statementsCount
      }
      statements {
        id
      }
      experts {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GetSource = gql`
  query GetSource($id: Int!) {
    source(id: $id) {
      id
      name
      sourceUrl
      releasedAt
      transcript
      medium {
        id
        name
      }
      mediaPersonalities {
        id
        name
      }
      statementsCountsByEvaluationStatus {
        evaluationStatus
        statementsCount
      }
      sourceSpeakers {
        id
        firstName
        lastName
        role
        speaker {
          id
          avatar
        }
        body {
          id
        }
      }
      experts {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GetSourceDetail = gql`
  query GetSourceDetail($id: Int!) {
    source(id: $id) {
      id
      name
      sourceUrl
      releasedAt
      sourceSpeakers {
        id
        firstName
        lastName
        role
        speaker {
          id
        }
        body {
          id
        }
      }
      medium {
        id
        name
      }
      mediaPersonalities {
        id
        name
      }
      experts {
        id
        firstName
        lastName
      }
    }
    statements(source: $id, includeUnpublished: true, limit: 500) {
      id
      content
      published
      commentsCount
      sourceSpeaker {
        id
        firstName
        lastName
        speaker {
          id
        }
      }
      assessment {
        id
        explanationCharactersLength
        shortExplanationCharactersLength
        assessmentMethodology {
          id
          ratingModel
          ratingKeys
        }
        evaluator {
          id
          firstName
          lastName
        }
        evaluationStatus
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
    }
  }
`;

export const GetSourceInternalStats = gql`
  query GetSourceInternalStats($id: Int!) {
    source(id: $id) {
      id
      internalStats
    }
  }
`;

export const GetSourcesForSelect = gql`
  query GetSourcesForSelect {
    sources(offset: 0, limit: 10000, includeOnesWithoutPublishedStatements: true) {
      id
      name
      releasedAt
      medium {
        id
        name
      }
    }
  }
`;

// TODO: add pagination and control limit
export const GetSourceStatements = gql`
  query GetSourceStatements($sourceId: Int!, $includeUnpublished: Boolean) {
    statements(limit: 200, source: $sourceId, includeUnpublished: $includeUnpublished) {
      id
      statementType
      content
      title
      important
      published
      sourceSpeaker {
        id
        firstName
        lastName
        role
        speaker {
          id
          avatar
        }
      }
      assessment {
        id
        assessmentMethodology {
          id
          ratingModel
          ratingKeys
        }
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
        shortExplanation
        shortExplanationCharactersLength
        explanationCharactersLength
      }
      statementTranscriptPosition {
        id
        startLine
        startOffset
        endLine
        endOffset
      }
      tags {
        id
        name
      }
      commentsCount
      sourceOrder
    }
  }
`;

export const GetUsers = gql`
  query GetUsers($name: String, $includeInactive: Boolean) {
    users(limit: 100, name: $name, includeInactive: $includeInactive) {
      id
      email
      firstName
      lastName
      avatar
      active
      bio
      positionDescription
      emailNotifications
      userPublic
      rank
      role {
        id
        name
      }
    }
  }
`;

export const GetUser = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      avatar
      active
      bio
      positionDescription
      emailNotifications
      userPublic
      role {
        id
        name
      }
    }
  }
`;

export const GetBodies = gql`
  query GetBodies($name: String) {
    bodies(limit: 100, name: $name) {
      id
      logo
      link
      name
      isParty
      isInactive
      shortName
      foundedAt
      terminatedAt
    }
  }
`;

export const GetBody = gql`
  query GetBody($id: Int!) {
    body(id: $id) {
      id
      logo
      link
      name
      isParty
      isInactive
      shortName
      foundedAt
      terminatedAt
    }
  }
`;

export const GetSpeakerBodies = gql`
  query GetSpeakerBodies {
    bodies(limit: 1000) {
      id
      name
      shortName
      isInactive
      terminatedAt
    }
  }
`;

export const GetSpeaker = gql`
  query GetSpeaker($id: Int!) {
    speaker(id: $id) {
      id
      firstName
      lastName
      websiteUrl
      avatar
      osobaId
      wikidataId
      role
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
`;

export const GetSpeakers = gql`
  query GetSpeakers($limit: Int, $offset: Int, $name: String) {
    speakers(limit: $limit, offset: $offset, name: $name) {
      id
      firstName
      lastName
      avatar
      websiteUrl
      osobaId
      wikidataId
      role
      body {
        id
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
`;

export const GetStatement = gql`
  query GetStatement($id: Int!) {
    statement(id: $id, includeUnpublished: true) {
      id
      statementType
      content
      title
      important
      published
      excerptedAt
      sourceSpeaker {
        id
        firstName
        lastName
        role
        speaker {
          id
          avatar
        }
      }
      assessment {
        id
        assessmentMethodology {
          id
          ratingModel
          ratingKeys
        }
        explanationHtml
        explanationSlatejson
        shortExplanation
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
        name
        sourceUrl
        releasedAt
        medium {
          id
          name
        }
        mediaPersonalities {
          id
          name
        }
        experts {
          id
          firstName
          lastName
        }
        sourceSpeakers {
          id
          firstName
          lastName
          speaker {
            id
          }
        }
      }
      statementTranscriptPosition {
        id
      }
      tags {
        id
        name
      }
      articleTags {
        id
        title
      }
      commentsCount
    }
  }
`;

export const GetStatementComments = gql`
  query GetStatementComments($id: Int!) {
    statement(id: $id, includeUnpublished: true) {
      id
      commentsCount
      comments {
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

export const GetRoles = gql`
  query GetRoles {
    roles {
      id
      key
      name
    }
  }
`;

export const GetCurrentUser = gql`
  query GetCurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
      role {
        id
        key
        name
        permissions
      }
    }
  }
`;

export const GetContentImages = gql`
  query GetContentImages($name: String, $offset: Int, $limit: Int) {
    contentImages(offset: $offset, limit: $limit, name: $name) {
      totalCount
      items {
        id
        image
        image50x50
        name
        createdAt
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const GetNotifications = gql`
  query GetNotifications($includeRead: Boolean, $offset: Int, $limit: Int) {
    notifications(includeRead: $includeRead, offset: $offset, limit: $limit) {
      totalCount
      items {
        id
        fullText
        statementText
        statement {
          id
          content
          statementType
          sourceSpeaker {
            id
            firstName
            lastName
            speaker {
              id
            }
          }
          source {
            id
            name
          }
        }
        createdAt
        readAt
      }
    }
  }
`;

export const GetPromiseRatingsForSelect = gql`
  query GetPromiseRatingsForSelect {
    promiseRatings {
      id
      key
      name
    }
  }
`;

export const GetTags = gql`
  query GetTags {
    tags(limit: 10000) {
      id
      name
      forStatementType
      publishedStatementsCount
      allStatementsCount
    }
  }
`;

export const GetArticleTags = gql`
  query GetArticleTags {
    articleTags(limit: 10000) {
      id
      title
      slug
      description
      icon
      stats
      published
      order
      video
    }
  }
`;

export const GetArticleTag = gql`
  query GetArticleTag($id: ID!) {
    articleTag(id: $id) {
      id
      title
      slug
      description
      icon
      stats
      published
      order
      video
    }
  }
`;

export const GetArticleTagsForSelect = gql`
  query GetArticleTagsForSelect {
    articleTags(limit: 10000) {
      id
      title
    }
  }
`;

export const GetTagsForSelect = gql`
  query GetTagsForSelect($forStatementType: StatementType!) {
    tags(limit: 10000, forStatementType: $forStatementType) {
      id
      name
    }
  }
`;

export const GetVeracitiesForSelect = gql`
  query GetVeracitiesForSelect {
    veracities {
      id
      key
      name
    }
  }
`;

export const GetUsersForSelect = gql`
  query GetUsersForSelect($roles: [String!]) {
    users(limit: 200, roles: $roles) {
      id
      firstName
      lastName
    }
  }
`;

export const GetSpeakersForSelect = gql`
  query GetSpeakersForSelect {
    speakers(limit: 10000) {
      id
      firstName
      lastName
      body {
        id
        shortName
      }
      role
      avatar
    }
  }
`;

export const GetMediaPersonalitiesForSelect = gql`
  query GetMediaPersonalitiesForSelect {
    mediaPersonalities {
      id
      name
    }
  }
`;

export const GetSourceWithStatementsAndVideoMarks = gql`
  query GetSourceWithStatementsAndVideoMarks($id: Int!, $includeUnpublished: Boolean) {
    source(id: $id) {
      id
      name
      sourceUrl
      releasedAt
      transcript
      videoType
      videoId
      statements(includeUnpublished: $includeUnpublished) {
        id
        content
        sourceSpeaker {
          id
          firstName
          lastName
          speaker {
            id
          }
        }
        statementVideoMark {
          id
          start
          stop
        }
      }
    }
  }
`;

export const GetInternalOverallStats = gql`
  query GetInternalOverallStats {
    internalOverallStats {
      factualAndPublishedStatementsCount
      speakersWithFactualAndPublishedStatementsCount
    }
  }
`;

export const GetWebContents = gql`
  query GetWebContents {
    webContents {
      id
      systemId
      name
      urlPath
      dynamicPage
      dynamicPagePublished
      structure
      data
    }
  }
`;

export const GetWebContent = gql`
  query GetWebContent($id: ID!) {
    webContent(id: $id) {
      id
      systemId
      name
      urlPath
      dynamicPage
      dynamicPagePublished
      structure
      data
    }
  }
`;

export const GetUserStatements = gql`
  query GetUserStatements(
    $limit: Int
    $offset: Int
    $includeUnpublished: Boolean
    $evaluatedByUserId: ID
    $sortSourcesInReverseChronologicalOrder: Boolean
  ) {
    statements(
      limit: $limit
      offset: $offset
      includeUnpublished: $includeUnpublished
      evaluatedByUserId: $evaluatedByUserId
      sortSourcesInReverseChronologicalOrder: $sortSourcesInReverseChronologicalOrder
    ) {
      id
      statementType
      content
      title
      important
      published
      source {
        id
        name
        sourceUrl
        releasedAt
        medium {
          id
          name
        }
        mediaPersonalities {
          id
          name
        }
        experts {
          id
          firstName
          lastName
        }
        sourceSpeakers {
          id
          firstName
          lastName
          speaker {
            id
          }
        }
      }
      sourceSpeaker {
        id
        firstName
        lastName
        role
        speaker {
          id
          avatar
        }
      }
      assessment {
        id
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
        shortExplanation
        shortExplanationCharactersLength
        explanationCharactersLength
      }
      tags {
        id
        name
      }
      commentsCount
      sourceOrder
    }
  }
`;
