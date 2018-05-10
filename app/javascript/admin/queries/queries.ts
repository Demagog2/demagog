import gql from 'graphql-tag';

export const GetBodies = gql`
  query GetBodies($name: String) {
    bodies(limit: 100, name: $name) {
      id
      logo
      name
      is_party
      short_name
      description
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
      description
      founded_at
      terminated_at
    }
  }
`;

export const GetSpeakersBodies = gql`
  query GetSpeakerBodies {
    bodies(limit: 1000) {
      id
      name
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
      party {
        id
        name
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
      party {
        short_name
      }
    }
  }
`;
