import gql from 'graphql-tag';

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

export const DeleteUser = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const CreateStatement = gql`
  mutation CreateStatement($statementInput: StatementInputType!) {
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
