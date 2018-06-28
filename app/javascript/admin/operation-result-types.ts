/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface ArticleInputType {
  title: string,
  perex: string,
  slug?: string | null,
  published?: boolean | null,
  published_at?: string | null,
  segments?: Array< SegmentInputType > | null,
};

export interface SegmentInputType {
  id?: string | null,
  segment_type: string,
  text_html?: string | null,
  text_slatejson?: GraphQLCustomScalar_JSON | null,
  statements?: Array< string > | null,
};

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
  memberships: Array< MembershipInputType >,
};

export interface MembershipInputType {
  id?: string | null,
  since?: string | null,
  until?: string | null,
  body: MembershipBodyInputType,
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
  role_id?: string | null,
};

export interface CreateStatementInputType {
  content: string,
  excerpted_at: string,
  important: boolean,
  speaker_id: string,
  source_id: string,
  published: boolean,
  count_in_statistics: boolean,
  assessment: CreateAssessmentInputType,
  statement_transcript_position?: StatementTranscriptPositionInputType | null,
  first_comment_content?: string | null,
};

export interface CreateAssessmentInputType {
  evaluator_id?: string | null,
  explanation?: string | null,
  veracity_id?: string | null,
};

export interface StatementTranscriptPositionInputType {
  start_line: number,
  start_offset: number,
  end_line: number,
  end_offset: number,
};

export interface UpdateStatementInputType {
  content?: string | null,
  important?: boolean | null,
  published?: boolean | null,
  count_in_statistics?: boolean | null,
  assessment?: UpdateAssessmentInputType | null,
};

export interface UpdateAssessmentInputType {
  evaluator_id?: string | null,
  evaluation_status?: string | null,
  explanation_html?: string | null,
  explanation_slatejson?: GraphQLCustomScalar_JSON | null,
  short_explanation?: string | null,
  veracity_id?: string | null,
};

export interface CommentInputType {
  content: string,
  statement_id: string,
};

export interface UpdateSourceStatementsOrderInputType {
  ordered_statement_ids?: Array< string > | null,
};

export interface CreateArticleMutationVariables {
  articleInput: ArticleInputType,
};

export interface CreateArticleMutation {
  /**
   * Add new article
   */
  createArticle:  {
    id: string,
    title: string,
  } | null,
};

export interface UpdateArticleMutationVariables {
  id: string,
  articleInput: ArticleInputType,
};

export interface UpdateArticleMutation {
  /**
   * Update existing article
   */
  updateArticle:  {
    id: string,
    title: string,
  } | null,
};

export interface DeleteArticleMutationVariables {
  id: string,
};

export interface DeleteArticleMutation {
  /**
   * Delete existing article
   */
  deleteArticle: string,
};

export interface CreateSourceMutationVariables {
  sourceInput: SourceInputType,
};

export interface CreateSourceMutation {
  /**
   * Add new source
   */
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
  /**
   * Update existing source
   */
  updateSource:  {
    id: string,
    name: string,
  } | null,
};

export interface DeleteSourceMutationVariables {
  id: string,
};

export interface DeleteSourceMutation {
  /**
   * Delete existing source with all its statements
   */
  deleteSource: string,
};

export interface CreateBodyMutationVariables {
  bodyInput: BodyInputType,
};

export interface CreateBodyMutation {
  /**
   * Add new body
   */
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
  /**
   * Update existing body
   */
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
  /**
   * Delete existing body
   */
  deleteBody: string,
};

export interface CreateSpeakerMutationVariables {
  speakerInput: SpeakerInputType,
};

export interface CreateSpeakerMutation {
  /**
   * Add new speaker
   */
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
  /**
   * Update existing speaker
   */
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
  /**
   * Delete existing speaker
   */
  deleteSpeaker: string,
};

export interface CreateUserMutationVariables {
  userInput: UserInputType,
};

export interface CreateUserMutation {
  /**
   * Add new user
   */
  createUser:  {
    id: string,
    first_name: string | null,
    last_name: string | null,
    avatar: string | null,
    active: boolean,
    role:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface UpdateUserMutationVariables {
  id: number,
  userInput: UserInputType,
};

export interface UpdateUserMutation {
  /**
   * Update existing user
   */
  updateUser:  {
    id: string,
    first_name: string | null,
    last_name: string | null,
    avatar: string | null,
    active: boolean,
    role:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface DeleteUserMutationVariables {
  id: string,
};

export interface DeleteUserMutation {
  /**
   * Delete existing user
   */
  deleteUser: string,
};

export interface CreateStatementMutationVariables {
  statementInput: CreateStatementInputType,
};

export interface CreateStatementMutation {
  /**
   * Add new statement
   */
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

export interface UpdateStatementMutationVariables {
  id: number,
  statementInput: UpdateStatementInputType,
};

export interface UpdateStatementMutation {
  /**
   * Update existing statement
   */
  updateStatement:  {
    id: string,
    content: string,
    important: boolean,
    published: boolean,
    excerpted_at: string,
    speaker:  {
      id: string,
      first_name: string,
      last_name: string,
      avatar: string | null,
    },
    assessment:  {
      id: string,
      short_explanation: string | null,
      explanation_html: string | null,
      explanation_slatejson: GraphQLCustomScalar_JSON | null,
      evaluation_status: string,
      evaluator:  {
        id: string,
        first_name: string | null,
        last_name: string | null,
      } | null,
      veracity:  {
        id: string,
        key: GraphQLCustomScalar_VeracityKey,
        name: string,
      } | null,
    },
    comments_count: number,
  } | null,
};

export interface DeleteStatementMutationVariables {
  id: string,
};

export interface DeleteStatementMutation {
  /**
   * Delete existing statement
   */
  deleteStatement: string,
};

export interface CreateCommentMutationVariables {
  commentInput: CommentInputType,
};

export interface CreateCommentMutation {
  /**
   * Add new comment
   */
  createComment:  {
    id: string,
    content: string,
    user:  {
      id: string,
      first_name: string | null,
      last_name: string | null,
    },
    created_at: GraphQLCustomScalar_DateTime,
  } | null,
};

export interface UpdateSourceStatementsOrderMutationVariables {
  id: string,
  input: UpdateSourceStatementsOrderInputType,
};

export interface UpdateSourceStatementsOrderMutation {
  /**
   * Update order of statements in source
   */
  updateSourceStatementsOrder:  {
    id: string,
  } | null,
};

export interface GetArticleQueryVariables {
  id: string,
};

export interface GetArticleQuery {
  article:  {
    title: string,
    slug: string,
    perex: string | null,
    published: boolean,
    published_at: string | null,
    illustration: string | null,
    segments:  Array< {
      id: string,
      segment_type: string,
      text_html: string | null,
      text_slatejson: GraphQLCustomScalar_JSON | null,
      statements:  Array< {
        id: string,
      } >,
    } > | null,
  },
};

export interface GetArticlesQueryVariables {
  title?: string | null,
};

export interface GetArticlesQuery {
  articles:  Array< {
    id: string,
    title: string,
    slug: string,
    published: boolean,
    published_at: string | null,
  } >,
};

export interface GetMediaPersonalitiesQuery {
  media_personalities:  Array< {
    id: string,
    name: string,
  } >,
};

export interface GetMediaQuery {
  media:  Array< {
    id: string,
    name: string,
  } >,
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
    statements:  Array< {
      id: string,
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
    published: boolean,
    speaker:  {
      id: string,
      first_name: string,
      last_name: string,
      avatar: string | null,
    },
    assessment:  {
      id: string,
      evaluation_status: string,
      evaluator:  {
        id: string,
        first_name: string | null,
        last_name: string | null,
      } | null,
    },
    statement_transcript_position:  {
      id: string,
      start_line: number,
      start_offset: number,
      end_line: number,
      end_offset: number,
    } | null,
    comments_count: number,
    source_order: number | null,
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
    role:  {
      id: string,
      name: string,
    },
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
    role:  {
      id: string,
      name: string,
    },
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

export interface GetStatementQueryVariables {
  id: number,
};

export interface GetStatementQuery {
  statement:  {
    id: string,
    content: string,
    important: boolean,
    published: boolean,
    excerpted_at: string,
    speaker:  {
      id: string,
      first_name: string,
      last_name: string,
      avatar: string | null,
    },
    assessment:  {
      id: string,
      explanation_html: string | null,
      explanation_slatejson: GraphQLCustomScalar_JSON | null,
      short_explanation: string | null,
      evaluation_status: string,
      evaluator:  {
        id: string,
        first_name: string | null,
        last_name: string | null,
      } | null,
      veracity:  {
        id: string,
        key: GraphQLCustomScalar_VeracityKey,
        name: string,
      } | null,
    },
    source:  {
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
    },
    comments_count: number,
  },
};

export interface GetStatementCommentsQueryVariables {
  id: number,
};

export interface GetStatementCommentsQuery {
  statement:  {
    id: string,
    comments_count: number,
    comments:  Array< {
      id: string,
      content: string,
      user:  {
        id: string,
        first_name: string | null,
        last_name: string | null,
      },
      created_at: GraphQLCustomScalar_DateTime,
    } >,
  },
};

export interface GetRolesQuery {
  roles:  Array< {
    id: string,
    key: string,
    name: string,
  } >,
};

export interface GetCurrentUserQuery {
  current_user:  {
    id: string,
    first_name: string | null,
    last_name: string | null,
    email: string,
    role:  {
      id: string,
      key: string,
      name: string,
      permissions: Array< string >,
    },
  },
};
