import gql from 'graphql-tag';

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
