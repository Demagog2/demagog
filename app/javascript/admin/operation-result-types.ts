/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface BodyInputType {
  name: string;
  is_party: boolean;
  is_inactive: boolean;
  short_name?: string | null;
  link?: string | null;
  founded_at?: string | null;
  terminated_at?: string | null;
}

export interface SpeakerInputType {
  first_name: string;
  last_name: string;
  website_url?: string | null;
  memberships: Array<MembershipInputType | null>;
}

export interface MembershipInputType {
  id: number | null;
  body_id: number;
  since: string | null;
  until: string | null;
}

export interface CreateBodyMutationVariables {
  bodyInput: BodyInputType;
}

export interface CreateBodyMutation {
  // Add new body
  createBody: {
    id: string;
    logo: string | null;
    name: string;
    is_party: boolean;
    short_name: string | null;
    description: string | null;
  };
}

export interface UpdateBodyMutationVariables {
  id: number;
  bodyInput: BodyInputType;
}

export interface UpdateBodyMutation {
  // Update existing body
  updateBody: {
    id: string;
    logo: string | null;
    link: string | null;
    name: string;
    is_party: boolean;
    is_inactive: boolean;
    short_name: string | null;
    description: string | null;
    founded_at: string | null;
    terminated_at: string | null;
  } | null;
}

export interface CreateSpeakerMutationVariables {
  speakerInput: SpeakerInputType;
}

export interface CreateSpeakerMutation {
  // Add new speaker
  createSpeaker: {
    id: string;
    first_name: string;
    last_name: string;
    body: {
      short_name: string | null;
    } | null;
  };
}

export interface UpdateSpeakerMutationVariables {
  id: number;
  speakerInput: SpeakerInputType;
}

export interface UpdateSpeakerMutation {
  // Update existing speaker
  updateSpeaker: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    website_url: string;
    memberships: Array<{
      id: string;
      body: {
        id: string;
      };
      since: string | null;
      until: string | null;
    }>;
  } | null;
}

export interface GetBodiesQueryVariables {
  name?: string | null;
}

export interface GetBodiesQuery {
  bodies: Array<{
    id: string;
    logo: string | null;
    name: string;
    is_party: boolean;
    short_name: string | null;
    description: string | null;
  }>;
}

export interface GetBodyQueryVariables {
  id: number;
}

export interface GetBodyQuery {
  body: {
    id: string;
    logo: string | null;
    link: string | null;
    name: string;
    is_party: boolean;
    is_inactive: boolean;
    short_name: string | null;
    description: string | null;
    founded_at: string | null;
    terminated_at: string | null;
  };
}

export interface GetSpeakerBodiesQuery {
  bodies: Array<{
    id: string;
    name: string;
    short_name: string;
    is_inactive: boolean;
    terminated_at: string | null;
  }>;
}

export interface GetSpeakerQueryVariables {
  id: number;
}

export interface GetSpeakerQuery {
  speaker: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    website_url: string;
    memberships: Array<{
      id: string;
      body: {
        id: string;
      };
      since: string | null;
      until: string | null;
    }>;
  };
}

export interface GetSpeakersQueryVariables {
  name?: string | null;
}

export interface GetSpeakersQuery {
  speakers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    body: {
      short_name: string | null;
    } | null;
  } | null> | null;
}
