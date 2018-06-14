/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface SourceInputType {
  name: string,
  released_at: string,
  source_url?: string | null,
  medium_id?: string | null,
  media_personality_id?: string | null,
  transcript: string,
  speakers: Array< string >,
};

export interface BodyInputType {
  name: string,
  is_party: boolean,
  is_inactive: boolean,
  short_name?: string | null,
  link?: string | null,
  founded_at?: string | null,
  terminated_at?: string | null,
};

export interface SpeakerInputType {
  first_name: string,
  last_name: string,
  website_url?: string | null,
  memberships: Array< MembershipInputType | null >,
};

export interface MembershipInputType {
  id?: string | null,
  since?: string | null,
  until?: string | null,
  body?: MembershipBodyInputType | null,
};

export interface MembershipBodyInputType {
  id: string,
};

export interface UserInputType {
  email: string,
  active: boolean,
  first_name?: string | null,
  last_name?: string | null,
  position_description?: string | null,
  bio?: string | null,
  phone?: string | null,
  order?: number | null,
  rank?: number | null,
};

export interface StatementInputType {
  content: string,
  excerpted_at: string,
  important: boolean,
  speaker_id: string,
  source_id: string,
  published: boolean,
  count_in_statistics: boolean,
  statement_transcript_position?: StatementTranscriptPositionInputType | null,
};

export interface StatementTranscriptPositionInputType {
  start_line: number,
  start_offset: number,
  end_line: number,
  end_offset: number,
};

export interface CreateSourceMutationVariables {
  sourceInput: SourceInputType,
};

export interface CreateSourceMutation {
  // Add new source
  createSource:  {
    id: string,
    name: string,
  } | null,
};

export interface UpdateSourceMutationVariables {
  id: number,
  sourceInput: SourceInputType,
};

export interface UpdateSourceMutation {
  // Update existing source
  updateSource:  {
    id: string,
    name: string,
  } | null,
};

export interface DeleteSourceMutationVariables {
  id: string,
};

export interface DeleteSourceMutation {
  // Delete existing source with all its statements
  deleteSource: string,
};

export interface CreateBodyMutationVariables {
  bodyInput: BodyInputType,
};

export interface CreateBodyMutation {
  // Add new body
  createBody:  {
    id: string,
    logo: string | null,
    name: string,
    is_party: boolean,
    is_inactive: boolean,
    short_name: string | null,
    link: string | null,
    founded_at: string | null,
    terminated_at: string | null,
  } | null,
};

export interface UpdateBodyMutationVariables {
  id: number,
  bodyInput: BodyInputType,
};

export interface UpdateBodyMutation {
  // Update existing body
  updateBody:  {
    id: string,
    logo: string | null,
    name: string,
    is_party: boolean,
    is_inactive: boolean,
    short_name: string | null,
    link: string | null,
    founded_at: string | null,
    terminated_at: string | null,
  } | null,
};

export interface DeleteBodyMutationVariables {
  id: string,
};

export interface DeleteBodyMutation {
  // Delete existing body
  deleteBody: string,
};

export interface CreateSpeakerMutationVariables {
  speakerInput: SpeakerInputType,
};

export interface CreateSpeakerMutation {
  // Add new speaker
  createSpeaker:  {
    id: string,
    first_name: string,
    last_name: string,
    avatar: string | null,
    website_url: string,
    body:  {
      short_name: string | null,
    } | null,
    memberships:  Array< {
      id: string,
      body:  {
        id: string,
        short_name: string | null,
      },
      since: string | null,
      until: string | null,
    } >,
  } | null,
};

export interface UpdateSpeakerMutationVariables {
  id: number,
  speakerInput: SpeakerInputType,
};

export interface UpdateSpeakerMutation {
  // Update existing speaker
  updateSpeaker:  {
    id: string,
    first_name: string,
    last_name: string,
    avatar: string | null,
    website_url: string,
    body:  {
      short_name: string | null,
    } | null,
    memberships:  Array< {
      id: string,
      body:  {
        id: string,
        short_name: string | null,
      },
      since: string | null,
      until: string | null,
    } >,
  } | null,
};

export interface DeleteSpeakerMutationVariables {
  id: string,
};

export interface DeleteSpeakerMutation {
  // Delete existing speaker
  deleteSpeaker: string,
};

export interface CreateUserMutationVariables {
  userInput: UserInputType,
};

export interface CreateUserMutation {
  // Add new user
  createUser:  {
    id: string,
    first_name: string | null,
    last_name: string | null,
    active: boolean,
  } | null,
};

export interface UpdateUserMutationVariables {
  id: number,
  userInput: UserInputType,
};

export interface UpdateUserMutation {
  // Update existing user
  updateUser:  {
    id: string,
    first_name: string | null,
    last_name: string | null,
    avatar: string | null,
    active: boolean,
  } | null,
};

export interface DeleteUserMutationVariables {
  id: string,
};

export interface DeleteUserMutation {
  // Delete existing user
  deleteUser: string,
};

export interface CreateStatementMutationVariables {
  statementInput: StatementInputType,
};

export interface CreateStatementMutation {
  // Add new statement
  createStatement:  {
    id: string,
    content: string,
    excerpted_at: string,
    important: boolean,
    speaker:  {
      id: string,
    },
  } | null,
};

export interface DeleteStatementMutationVariables {
  id: string,
};

export interface DeleteStatementMutation {
  // Delete existing statement
  deleteStatement: string,
};

export interface GetSourcesQueryVariables {
  name?: string | null,
};

export interface GetSourcesQuery {
  sources:  Array< {
    id: string,
    name: string,
    source_url: string | null,
    released_at: string,
    medium:  {
      id: string,
      name: string,
    },
    media_personality:  {
      id: string,
      name: string,
    },
    speakers_statements_stats:  Array< {
      speaker:  {
        id: string,
        first_name: string,
        last_name: string,
      },
      statements_published_count: number,
    } >,
  } >,
};

export interface GetSourceQueryVariables {
  id: number,
};

export interface GetSourceQuery {
  source:  {
    id: string,
    name: string,
    source_url: string | null,
    released_at: string,
    transcript: string | null,
    medium:  {
      id: string,
      name: string,
    },
    media_personality:  {
      id: string,
      name: string,
    },
    speakers:  Array< {
      id: string,
      first_name: string,
      last_name: string,
    } >,
  },
};

export interface GetSourceStatementsQueryVariables {
  sourceId: number,
};

export interface GetSourceStatementsQuery {
  statements:  Array< {
    id: string,
    content: string,
    important: boolean,
    speaker:  {
      id: string,
      first_name: string,
      last_name: string,
      avatar: string | null,
    },
    statement_transcript_position:  {
      start_line: number,
      start_offset: number,
      end_line: number,
      end_offset: number,
    } | null,
  } >,
};

export interface GetUsersQueryVariables {
  name?: string | null,
  includeInactive?: boolean | null,
};

export interface GetUsersQuery {
  users:  Array< {
    id: string,
    email: string,
    first_name: string | null,
    last_name: string | null,
    avatar: string | null,
    active: boolean,
    bio: string | null,
    position_description: string | null,
  } >,
};

export interface GetUserQueryVariables {
  id: number,
};

export interface GetUserQuery {
  user:  {
    id: string,
    email: string,
    first_name: string | null,
    last_name: string | null,
    avatar: string | null,
    active: boolean,
    bio: string | null,
    position_description: string | null,
  },
};

export interface GetBodiesQueryVariables {
  name?: string | null,
};

export interface GetBodiesQuery {
  bodies:  Array< {
    id: string,
    logo: string | null,
    link: string | null,
    name: string,
    is_party: boolean,
    is_inactive: boolean,
    short_name: string | null,
    founded_at: string | null,
    terminated_at: string | null,
  } >,
};

export interface GetBodyQueryVariables {
  id: number,
};

export interface GetBodyQuery {
  body:  {
    id: string,
    logo: string | null,
    link: string | null,
    name: string,
    is_party: boolean,
    is_inactive: boolean,
    short_name: string | null,
    founded_at: string | null,
    terminated_at: string | null,
  },
};

export interface GetSpeakerBodiesQuery {
  bodies:  Array< {
    id: string,
    name: string,
    short_name: string | null,
    is_inactive: boolean,
    terminated_at: string | null,
  } >,
};

export interface GetSpeakerQueryVariables {
  id: number,
};

export interface GetSpeakerQuery {
  speaker:  {
    id: string,
    first_name: string,
    last_name: string,
    website_url: string,
    avatar: string | null,
    memberships:  Array< {
      id: string,
      body:  {
        id: string,
        short_name: string | null,
      },
      since: string | null,
      until: string | null,
    } >,
  },
};

export interface GetSpeakersQueryVariables {
  name?: string | null,
};

export interface GetSpeakersQuery {
  speakers:  Array< {
    id: string,
    first_name: string,
    last_name: string,
    avatar: string | null,
    website_url: string,
    body:  {
      short_name: string | null,
    } | null,
    memberships:  Array< {
      id: string,
      body:  {
        id: string,
        short_name: string | null,
      },
      since: string | null,
      until: string | null,
    } >,
  } >,
};
