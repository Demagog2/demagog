/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface MediaPersonalityInputType {
  name: string,
};

export interface MediumInputType {
  name: string,
};

export interface PageInputType {
  title: string,
  slug?: string | null,
  published?: boolean | null,
  text_html?: string | null,
  text_slatejson?: GraphQLCustomScalar_JSON | null,
};

export interface ArticleInputType {
  article_type: string,
  title: string,
  perex: string,
  slug?: string | null,
  published?: boolean | null,
  published_at?: string | null,
  segments?: Array< SegmentInputType > | null,
  source_id?: string | null,
};

export interface SegmentInputType {
  id?: string | null,
  segment_type: string,
  text_html?: string | null,
  text_slatejson?: GraphQLCustomScalar_JSON | null,
  source_id?: string | null,
};

export interface SourceInputType {
  name: string,
  released_at: string,
  source_url?: string | null,
  medium_id?: string | null,
  media_personalities: Array< string >,
  transcript: string,
  speakers: Array< string >,
  expert_id?: string | null,
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
  body_id: string,
};

export interface UserInputType {
  email: string,
  active: boolean,
  first_name: string,
  last_name: string,
  role_id: string,
  email_notifications: boolean,
  position_description?: string | null,
  bio?: string | null,
  phone?: string | null,
  order?: number | null,
  rank?: number | null,
};

export interface UpdateUsersRankInputType {
  ordered_user_ids?: Array< string > | null,
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

export interface UpdateNotificationInputType {
  read_at?: string | null,
};

export interface CreateMediaPersonalityMutationVariables {
  mediaPersonalityInput: MediaPersonalityInputType,
};

export interface CreateMediaPersonalityMutation {
  // Add new media personality
  createMediaPersonality:  {
    id: string,
    name: string,
  } | null,
};

export interface UpdateMediaPersonalityMutationVariables {
  id: string,
  mediaPersonalityInput: MediaPersonalityInputType,
};

export interface UpdateMediaPersonalityMutation {
  // Update existing media personality
  updateMediaPersonality:  {
    id: string,
    name: string,
  } | null,
};

export interface DeleteMediaPersonalityMutationVariables {
  id: string,
};

export interface DeleteMediaPersonalityMutation {
  // Delete existing media personality
  deleteMediaPersonality: string,
};

export interface CreateMediumMutationVariables {
  mediumInput: MediumInputType,
};

export interface CreateMediumMutation {
  // Add new medium
  createMedium:  {
    id: string,
    name: string,
  } | null,
};

export interface UpdateMediumMutationVariables {
  id: string,
  mediumInput: MediumInputType,
};

export interface UpdateMediumMutation {
  // Update existing medium
  updateMedium:  {
    id: string,
    name: string,
  } | null,
};

export interface DeleteMediumMutationVariables {
  id: string,
};

export interface DeleteMediumMutation {
  // Delete existing medium
  deleteMedium: string,
};

export interface CreatePageMutationVariables {
  pageInput: PageInputType,
};

export interface CreatePageMutation {
  // Add new page
  createPage:  {
    id: string,
    title: string,
    slug: string,
    published: boolean,
    text_html: string | null,
    text_slatejson: GraphQLCustomScalar_JSON | null,
  } | null,
};

export interface UpdatePageMutationVariables {
  id: string,
  pageInput: PageInputType,
};

export interface UpdatePageMutation {
  // Update existing page
  updatePage:  {
    id: string,
    title: string,
    slug: string,
    published: boolean,
    text_html: string | null,
    text_slatejson: GraphQLCustomScalar_JSON | null,
  } | null,
};

export interface DeletePageMutationVariables {
  id: string,
};

export interface DeletePageMutation {
  // Delete existing page
  deletePage: string,
};

export interface CreateArticleMutationVariables {
  articleInput: ArticleInputType,
};

export interface CreateArticleMutation {
  // Add new article
  createArticle:  {
    id: string,
    article_type: string,
    title: string,
    slug: string,
    perex: string | null,
    published: boolean,
    published_at: GraphQLCustomScalar_DateTime | null,
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
    source:  {
      id: string,
    } | null,
  } | null,
};

export interface UpdateArticleMutationVariables {
  id: string,
  articleInput: ArticleInputType,
};

export interface UpdateArticleMutation {
  // Update existing article
  updateArticle:  {
    id: string,
    article_type: string,
    title: string,
    slug: string,
    perex: string | null,
    published: boolean,
    published_at: GraphQLCustomScalar_DateTime | null,
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
    source:  {
      id: string,
    } | null,
  } | null,
};

export interface DeleteArticleMutationVariables {
  id: string,
};

export interface DeleteArticleMutation {
  // Delete existing article
  deleteArticle: string,
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
    first_name: string,
    last_name: string,
    email: string,
    avatar: string | null,
    active: boolean,
    position_description: string | null,
    bio: string | null,
    email_notifications: boolean,
    user_public: boolean,
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
  // Update existing user
  updateUser:  {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    avatar: string | null,
    active: boolean,
    position_description: string | null,
    bio: string | null,
    email_notifications: boolean,
    user_public: boolean,
    role:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface UpdateUserPublicityMutationVariables {
  id: number,
  userPublicity: boolean,
};

export interface UpdateUserPublicityMutation {
  // Update user publicity
  updateUserPublicity:  {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    avatar: string | null,
    active: boolean,
    position_description: string | null,
    bio: string | null,
    email_notifications: boolean,
    user_public: boolean,
    role:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface UpdateUsersRankMutationVariables {
  input: UpdateUsersRankInputType,
};

export interface UpdateUsersRankMutation {
  // Update rank (order of users on about us page)
  updateUsersRank:  Array< {
    id: string,
    rank: number | null,
  } > | null,
};

export interface DeleteUserMutationVariables {
  id: string,
};

export interface DeleteUserMutation {
  // Delete existing user
  deleteUser: string,
};

export interface CreateStatementMutationVariables {
  statementInput: CreateStatementInputType,
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
    source:  {
      id: string,
      statements_counts_by_evaluation_status:  Array< {
        evaluation_status: string,
        statements_count: number,
      } >,
    },
  } | null,
};

export interface UpdateStatementMutationVariables {
  id: number,
  statementInput: UpdateStatementInputType,
};

export interface UpdateStatementMutation {
  // Update existing statement
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
        first_name: string,
        last_name: string,
      } | null,
      veracity:  {
        id: string,
        key: GraphQLCustomScalar_VeracityKey,
        name: string,
      } | null,
    },
    source:  {
      id: string,
      statements_counts_by_evaluation_status:  Array< {
        evaluation_status: string,
        statements_count: number,
      } >,
    },
    comments_count: number,
  } | null,
};

export interface DeleteStatementMutationVariables {
  id: string,
};

export interface DeleteStatementMutation {
  // Delete existing statement
  deleteStatement: string,
};

export interface CreateCommentMutationVariables {
  commentInput: CommentInputType,
};

export interface CreateCommentMutation {
  // Add new comment
  createComment:  {
    id: string,
    content: string,
    user:  {
      id: string,
      first_name: string,
      last_name: string,
    },
    created_at: GraphQLCustomScalar_DateTime,
  } | null,
};

export interface UpdateSourceStatementsOrderMutationVariables {
  id: string,
  input: UpdateSourceStatementsOrderInputType,
};

export interface UpdateSourceStatementsOrderMutation {
  // Update order of statements in source
  updateSourceStatementsOrder:  {
    id: string,
  } | null,
};

export interface PublishApprovedSourceStatementsMutationVariables {
  id: string,
};

export interface PublishApprovedSourceStatementsMutation {
  // Publish all approved statements from source
  publishApprovedSourceStatements:  {
    id: string,
    statements:  Array< {
      id: string,
      published: boolean,
    } >,
  } | null,
};

export interface DeleteContentImageMutationVariables {
  id: string,
};

export interface DeleteContentImageMutation {
  // Delete existing content image
  deleteContentImage: string,
};

export interface UpdateNotificationMutationVariables {
  id: string,
  input: UpdateNotificationInputType,
};

export interface UpdateNotificationMutation {
  // Update notification
  updateNotification:  {
    id: string,
    read_at: GraphQLCustomScalar_DateTime | null,
  } | null,
};

export interface MarkUnreadNotificationsAsReadMutation {
  // Mark all unread notifications of current user as read
  markUnreadNotificationsAsRead:  Array< {
    id: string,
    read_at: GraphQLCustomScalar_DateTime | null,
  } > | null,
};

export interface GetPagesQueryVariables {
  title?: string | null,
  offset?: number | null,
  limit?: number | null,
};

export interface GetPagesQuery {
  pages:  Array< {
    id: string,
    title: string,
    slug: string,
    published: boolean,
  } >,
};

export interface GetPageQueryVariables {
  id: string,
};

export interface GetPageQuery {
  page:  {
    id: string,
    title: string,
    slug: string,
    published: boolean,
    text_html: string | null,
    text_slatejson: GraphQLCustomScalar_JSON | null,
  },
};

export interface GetArticleQueryVariables {
  id: string,
};

export interface GetArticleQuery {
  article:  {
    id: string,
    article_type: string,
    title: string,
    slug: string,
    perex: string | null,
    published: boolean,
    published_at: GraphQLCustomScalar_DateTime | null,
    illustration: string | null,
    segments:  Array< {
      id: string,
      segment_type: string,
      text_html: string | null,
      text_slatejson: GraphQLCustomScalar_JSON | null,
      source:  {
        id: string,
      } | null,
    } > | null,
    source:  {
      id: string,
    } | null,
  },
};

export interface GetArticlesQueryVariables {
  title?: string | null,
  offset?: number | null,
  limit?: number | null,
};

export interface GetArticlesQuery {
  articles:  Array< {
    id: string,
    article_type: string,
    title: string,
    slug: string,
    published: boolean,
    published_at: GraphQLCustomScalar_DateTime | null,
  } >,
};

export interface GetMediaPersonalitiesQueryVariables {
  name?: string | null,
};

export interface GetMediaPersonalitiesQuery {
  media_personalities:  Array< {
    id: string,
    name: string,
  } >,
};

export interface GetMediaPersonalityQueryVariables {
  id: string,
};

export interface GetMediaPersonalityQuery {
  media_personality:  {
    id: string,
    name: string,
  },
};

export interface GetMediaQueryVariables {
  name?: string | null,
};

export interface GetMediaQuery {
  media:  Array< {
    id: string,
    name: string,
  } >,
};

export interface GetMediumQueryVariables {
  id: string,
};

export interface GetMediumQuery {
  medium:  {
    id: string,
    name: string,
  },
};

export interface GetSourcesQueryVariables {
  name?: string | null,
  offset?: number | null,
  limit?: number | null,
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
    media_personalities:  Array< {
      id: string,
      name: string,
    } >,
    statements_counts_by_evaluation_status:  Array< {
      evaluation_status: string,
      statements_count: number,
    } >,
    statements:  Array< {
      id: string,
    } >,
    expert:  {
      id: string,
      first_name: string,
      last_name: string,
    } | null,
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
    media_personalities:  Array< {
      id: string,
      name: string,
    } >,
    statements_counts_by_evaluation_status:  Array< {
      evaluation_status: string,
      statements_count: number,
    } >,
    speakers:  Array< {
      id: string,
      first_name: string,
      last_name: string,
    } >,
    expert:  {
      id: string,
      first_name: string,
      last_name: string,
    } | null,
  },
};

export interface GetSourcesForSelectQuery {
  sources:  Array< {
    id: string,
    name: string,
    released_at: string,
    medium:  {
      id: string,
      name: string,
    },
  } >,
};

export interface GetSourceStatementsQueryVariables {
  sourceId: number,
  includeUnpublished?: boolean | null,
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
        first_name: string,
        last_name: string,
      } | null,
      veracity:  {
        id: string,
        key: GraphQLCustomScalar_VeracityKey,
        name: string,
      } | null,
      short_explanation: string | null,
      short_explanation_characters_length: number,
      explanation_characters_length: number,
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
    first_name: string,
    last_name: string,
    avatar: string | null,
    active: boolean,
    bio: string | null,
    position_description: string | null,
    email_notifications: boolean,
    user_public: boolean,
    rank: number | null,
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
    first_name: string,
    last_name: string,
    avatar: string | null,
    active: boolean,
    bio: string | null,
    position_description: string | null,
    email_notifications: boolean,
    user_public: boolean,
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
    count_in_statistics: boolean,
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
        first_name: string,
        last_name: string,
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
      media_personalities:  Array< {
        id: string,
        name: string,
      } >,
      expert:  {
        id: string,
        first_name: string,
        last_name: string,
      } | null,
    },
    statement_transcript_position:  {
      id: string,
    } | null,
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
        first_name: string,
        last_name: string,
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
    first_name: string,
    last_name: string,
    email: string,
    role:  {
      id: string,
      key: string,
      name: string,
      permissions: Array< string >,
    },
  },
};

export interface GetContentImagesQueryVariables {
  name?: string | null,
  offset?: number | null,
  limit?: number | null,
};

export interface GetContentImagesQuery {
  content_images:  {
    total_count: number,
    items:  Array< {
      id: string,
      image: string,
      image_50x50: string,
      name: string,
      created_at: GraphQLCustomScalar_DateTime,
      user:  {
        id: string,
        first_name: string,
        last_name: string,
      } | null,
    } >,
  },
};

export interface GetNotificationsQueryVariables {
  includeRead?: boolean | null,
  offset?: number | null,
  limit?: number | null,
};

export interface GetNotificationsQuery {
  notifications:  {
    total_count: number,
    items:  Array< {
      id: string,
      content: string,
      action_link: string,
      action_text: string,
      created_at: GraphQLCustomScalar_DateTime,
      read_at: GraphQLCustomScalar_DateTime | null,
    } >,
  },
};
