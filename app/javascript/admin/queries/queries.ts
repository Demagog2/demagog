import gql from 'graphql-tag';

export const GetArticle = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
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
    }
  }
`;

export const GetArticles = gql`
  query GetArticles($title: String) {
    articles(include_unpublished: true, limit: 100, title: $title) {
      id
      title
      slug
      published
      published_at
    }
  }
`;

export const GetMediaPersonalities = gql`
  query GetMediaPersonalities {
    media_personalities {
      id
      name
    }
  }
`;

export const GetMedia = gql`
  query GetMedia {
    media {
      id
      name
    }
  }
`;

export const GetSources = gql`
  query GetSources($name: String) {
    sources(limit: 100, name: $name) {
      id
      name
      source_url
      released_at
      medium {
        id
        name
      }
      media_personality {
        id
        name
      }
      speakers_statements_stats {
        speaker {
          id
          first_name
          last_name
        }
        statements_published_count
      }
      statements {
        id
      }
    }
  }
`;

export const GetSource = gql`
  query GetSource($id: Int!) {
    source(id: $id) {
      id
      name
      source_url
      released_at
      transcript
      medium {
        id
        name
      }
      media_personality {
        id
        name
      }
      speakers {
        id
        first_name
        last_name
      }
    }
  }
`;

// TODO: add pagination and control limit
export const GetSourceStatements = gql`
  query GetSourceStatements($sourceId: Int!) {
    statements(limit: 100, source: $sourceId, include_unpublished: true) {
      id
      content
      important
      published
      speaker {
        id
        first_name
        last_name
        avatar
      }
      assessment {
        id
        evaluation_status
        evaluator {
          id
          first_name
          last_name
        }
      }
      statement_transcript_position {
        id
        start_line
        start_offset
        end_line
        end_offset
      }
      comments_count
      source_order
    }
  }
`;

export const GetUsers = gql`
  query GetUsers($name: String, $includeInactive: Boolean) {
    users(limit: 100, name: $name, include_inactive: $includeInactive) {
      id
      email
      first_name
      last_name
      avatar
      active
      bio
      position_description
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
      first_name
      last_name
      avatar
      active
      bio
      position_description
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
      is_party
      is_inactive
      short_name
      founded_at
      terminated_at
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
      is_party
      is_inactive
      short_name
      founded_at
      terminated_at
    }
  }
`;

export const GetSpeakerBodies = gql`
  query GetSpeakerBodies {
    bodies(limit: 1000) {
      id
      name
      short_name
      is_inactive
      terminated_at
    }
  }
`;

export const GetSpeaker = gql`
  query GetSpeaker($id: Int!) {
    speaker(id: $id) {
      id
      first_name
      last_name
      website_url
      avatar
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

export const GetSpeakers = gql`
  query GetSpeakers($name: String) {
    speakers(limit: 100, name: $name) {
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

export const GetStatement = gql`
  query GetStatement($id: Int!) {
    statement(id: $id, include_unpublished: true) {
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
        explanation_html
        explanation_slatejson
        short_explanation
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
      source {
        id
        name
        source_url
        released_at
        medium {
          id
          name
        }
        media_personality {
          id
          name
        }
      }
      comments_count
    }
  }
`;

export const GetStatementComments = gql`
  query GetStatementComments($id: Int!) {
    statement(id: $id, include_unpublished: true) {
      id
      comments_count
      comments {
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
    current_user {
      id
      first_name
      last_name
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
  query GetContentImages($name: String) {
    content_images(limit: 20, name: $name) {
      total_count
      items {
        id
        image
        image_50x50
        name
        created_at
        user {
          id
          first_name
          last_name
        }
      }
    }
  }
`;
