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

export const CreateSpeaker = gql`
  mutation CreateSpeaker($speakerInput: SpeakerInputType!) {
    createSpeaker(speaker_input: $speakerInput) {
      id
      first_name
      last_name
      website_url
      body {
        short_name
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
        }
        since
        until
      }
    }
  }
`;

export const CreateUser = gql`
  mutation CreateUser($userInput: UserInputType!) {
    createUser(user_input: $userInput) {
      id
      first_name
      last_name
      active
    }
  }
`;

export const UpdateUser = gql`
  mutation UpdateUser($id: Int!, $userInput: UserInputType!) {
    updateUser(id: $id, user_input: $userInput) {
      id
      first_name
      last_name
      avatar
      active
    }
  }
`;
