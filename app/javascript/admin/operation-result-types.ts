/* tslint:disable */
//  This file was automatically generated and should not be edited.

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
  id?: number | null,
  body_id: number,
  since?: string | null,
  until?: string | null,
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

export interface GetUsersQueryVariables {
  name?: string | null,
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
    description: string | null,
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
    description: string | null,
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
