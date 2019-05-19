/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface MediaPersonalityInput {
  name: string,
};

export interface MediumInput {
  name: string,
};

export interface PageInput {
  title: string,
  textHtml?: string | null,
  textSlatejson?: GraphQLCustomScalar_JSON | null,
  published?: boolean | null,
  slug?: string | null,
};

export interface ArticleInput {
  articleType: string,
  title: string,
  perex: string,
  segments: Array< ArticleSegmentInput >,
  slug?: string | null,
  published?: boolean | null,
  publishedAt?: string | null,
  sourceId?: string | null,
};

export interface ArticleSegmentInput {
  id?: string | null,
  segmentType: string,
  textHtml?: string | null,
  textSlatejson?: GraphQLCustomScalar_JSON | null,
  sourceId?: string | null,
  promiseUrl?: string | null,
};

export interface SourceInput {
  name: string,
  releasedAt: string,
  sourceUrl?: string | null,
  mediumId: string,
  mediaPersonalities: Array< string >,
  transcript: string,
  speakers: Array< string >,
  expertId?: string | null,
};

export interface BodyInput {
  name: string,
  isParty: boolean,
  isInactive: boolean,
  shortName?: string | null,
  link?: string | null,
  foundedAt?: string | null,
  terminatedAt?: string | null,
};

export interface SpeakerInput {
  firstName: string,
  lastName: string,
  websiteUrl?: string | null,
  memberships: Array< MembershipInput >,
};

export interface MembershipInput {
  id?: string | null,
  since?: string | null,
  until?: string | null,
  bodyId: string,
};

export interface UserInput {
  email: string,
  active: boolean,
  firstName: string,
  lastName: string,
  roleId: string,
  emailNotifications: boolean,
  positionDescription?: string | null,
  bio?: string | null,
  phone?: string | null,
  order?: number | null,
  rank?: number | null,
};

export interface CreateStatementInput {
  statementType: StatementType,
  content: string,
  excerptedAt: string,
  important: boolean,
  speakerId: string,
  sourceId: string,
  published: boolean,
  countInStatistics: boolean,
  assessment: CreateAssessmentInput,
  statementTranscriptPosition?: StatementTranscriptPositionInput | null,
  firstCommentContent?: string | null,
};

export enum StatementType {
  factual = "factual",
  promise = "promise",
}


export interface CreateAssessmentInput {
  evaluatorId?: string | null,
  shortExplanation?: string | null,
  veracityId?: string | null,
};

export interface StatementTranscriptPositionInput {
  startLine: number,
  startOffset: number,
  endLine: number,
  endOffset: number,
};

export interface UpdateStatementInput {
  content?: string | null,
  title?: string | null,
  important?: boolean | null,
  published?: boolean | null,
  countInStatistics?: boolean | null,
  assessment?: UpdateAssessmentInput | null,
  tags?: Array< string > | null,
  speaker?: string | null,
};

export interface UpdateAssessmentInput {
  evaluatorId?: string | null,
  evaluationStatus?: string | null,
  explanationHtml?: string | null,
  explanationSlatejson?: GraphQLCustomScalar_JSON | null,
  shortExplanation?: string | null,
  veracityId?: string | null,
  promiseRatingId?: string | null,
};

export enum PromiseRatingKey {
  broken = "broken",
  fulfilled = "fulfilled",
  in_progress = "in_progress",
  partially_fulfilled = "partially_fulfilled",
  stalled = "stalled",
}


export interface CommentInput {
  content: string,
  statementId: string,
};

export interface UpdateSourceStatementsOrderInput {
  orderedStatementIds: Array< string >,
};

export interface UpdateNotificationInput {
  readAt?: string | null,
};

export enum AssessmentMethodologyRatingModel {
  promise_rating = "promise_rating",
  veracity = "veracity",
}


export interface CreateMediaPersonalityMutationVariables {
  mediaPersonalityInput: MediaPersonalityInput,
};

export interface CreateMediaPersonalityMutation {
  // Add new media personality
  createMediaPersonality:  {
    mediaPersonality:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface UpdateMediaPersonalityMutationVariables {
  id: string,
  mediaPersonalityInput: MediaPersonalityInput,
};

export interface UpdateMediaPersonalityMutation {
  // Update existing media personality
  updateMediaPersonality:  {
    mediaPersonality:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface DeleteMediaPersonalityMutationVariables {
  id: string,
};

export interface DeleteMediaPersonalityMutation {
  // Delete existing media personality
  deleteMediaPersonality:  {
    id: string,
  } | null,
};

export interface CreateMediumMutationVariables {
  mediumInput: MediumInput,
};

export interface CreateMediumMutation {
  // Add new medium
  createMedium:  {
    medium:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface UpdateMediumMutationVariables {
  id: string,
  mediumInput: MediumInput,
};

export interface UpdateMediumMutation {
  // Update existing medium
  updateMedium:  {
    medium:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface DeleteMediumMutationVariables {
  id: string,
};

export interface DeleteMediumMutation {
  // Delete existing medium
  deleteMedium:  {
    id: string,
  } | null,
};

export interface CreatePageMutationVariables {
  pageInput: PageInput,
};

export interface CreatePageMutation {
  // Add new page
  createPage:  {
    page:  {
      id: string,
      title: string,
      slug: string,
      published: boolean,
      textHtml: string | null,
      textSlatejson: GraphQLCustomScalar_JSON | null,
    },
  } | null,
};

export interface UpdatePageMutationVariables {
  id: string,
  pageInput: PageInput,
};

export interface UpdatePageMutation {
  // Update existing page
  updatePage:  {
    page:  {
      id: string,
      title: string,
      slug: string,
      published: boolean,
      textHtml: string | null,
      textSlatejson: GraphQLCustomScalar_JSON | null,
    },
  } | null,
};

export interface DeletePageMutationVariables {
  id: string,
};

export interface DeletePageMutation {
  // Delete existing page
  deletePage:  {
    id: string | null,
  } | null,
};

export interface CreateArticleMutationVariables {
  articleInput: ArticleInput,
};

export interface CreateArticleMutation {
  // Add new article
  createArticle:  {
    article:  {
      id: string,
      articleType: string,
      title: string,
      slug: string,
      perex: string | null,
      published: boolean,
      publishedAt: GraphQLCustomScalar_DateTime | null,
      illustration: string | null,
      segments:  Array< {
        id: string,
        segmentType: string,
        textHtml: string | null,
        textSlatejson: GraphQLCustomScalar_JSON | null,
        promiseUrl: string | null,
        statements:  Array< {
          id: string,
        } >,
      } >,
      source:  {
        id: string,
      } | null,
    },
  } | null,
};

export interface UpdateArticleMutationVariables {
  id: string,
  articleInput: ArticleInput,
};

export interface UpdateArticleMutation {
  // Update existing article
  updateArticle:  {
    article:  {
      id: string,
      articleType: string,
      title: string,
      slug: string,
      perex: string | null,
      published: boolean,
      publishedAt: GraphQLCustomScalar_DateTime | null,
      illustration: string | null,
      segments:  Array< {
        id: string,
        segmentType: string,
        textHtml: string | null,
        textSlatejson: GraphQLCustomScalar_JSON | null,
        promiseUrl: string | null,
        statements:  Array< {
          id: string,
        } >,
      } >,
      source:  {
        id: string,
      } | null,
    },
  } | null,
};

export interface DeleteArticleMutationVariables {
  id: string,
};

export interface DeleteArticleMutation {
  // Delete existing article
  deleteArticle:  {
    id: string | null,
  } | null,
};

export interface CreateSourceMutationVariables {
  sourceInput: SourceInput,
};

export interface CreateSourceMutation {
  // Add new source
  createSource:  {
    source:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface UpdateSourceMutationVariables {
  id: string,
  sourceInput: SourceInput,
};

export interface UpdateSourceMutation {
  // Update existing source
  updateSource:  {
    source:  {
      id: string,
      name: string,
    },
  } | null,
};

export interface DeleteSourceMutationVariables {
  id: string,
};

export interface DeleteSourceMutation {
  // Delete existing source and all it's statements
  deleteSource:  {
    id: string,
  } | null,
};

export interface CreateBodyMutationVariables {
  bodyInput: BodyInput,
};

export interface CreateBodyMutation {
  // Create new body
  createBody:  {
    body:  {
      id: string,
      logo: string | null,
      name: string,
      isParty: boolean,
      isInactive: boolean,
      shortName: string | null,
      link: string | null,
      foundedAt: string | null,
      terminatedAt: string | null,
    },
  } | null,
};

export interface UpdateBodyMutationVariables {
  id: number,
  bodyInput: BodyInput,
};

export interface UpdateBodyMutation {
  // Update existing body
  updateBody:  {
    body:  {
      id: string,
      logo: string | null,
      name: string,
      isParty: boolean,
      isInactive: boolean,
      shortName: string | null,
      link: string | null,
      foundedAt: string | null,
      terminatedAt: string | null,
    },
  } | null,
};

export interface DeleteBodyMutationVariables {
  id: string,
};

export interface DeleteBodyMutation {
  // Delete existing body
  deleteBody:  {
    id: string,
  } | null,
};

export interface CreateSpeakerMutationVariables {
  speakerInput: SpeakerInput,
};

export interface CreateSpeakerMutation {
  // Add new speaker
  createSpeaker:  {
    speaker:  {
      id: string,
      firstName: string,
      lastName: string,
      avatar: string | null,
      websiteUrl: string,
      body:  {
        shortName: string | null,
      } | null,
      memberships:  Array< {
        id: string,
        body:  {
          id: string,
          shortName: string | null,
        },
        since: string | null,
        until: string | null,
      } > | null,
    },
  } | null,
};

export interface UpdateSpeakerMutationVariables {
  id: string,
  speakerInput: SpeakerInput,
};

export interface UpdateSpeakerMutation {
  // Update existing speaker
  updateSpeaker:  {
    speaker:  {
      id: string,
      firstName: string,
      lastName: string,
      avatar: string | null,
      websiteUrl: string,
      body:  {
        shortName: string | null,
      } | null,
      memberships:  Array< {
        id: string,
        body:  {
          id: string,
          shortName: string | null,
        },
        since: string | null,
        until: string | null,
      } > | null,
    },
  } | null,
};

export interface DeleteSpeakerMutationVariables {
  id: string,
};

export interface DeleteSpeakerMutation {
  // Delete existing speaker
  deleteSpeaker:  {
    id: string,
  } | null,
};

export interface CreateUserMutationVariables {
  userInput: UserInput,
};

export interface CreateUserMutation {
  // Add new user
  createUser:  {
    user:  {
      id: string,
      firstName: string,
      lastName: string,
      email: string,
      avatar: string | null,
      active: boolean,
      positionDescription: string | null,
      bio: string | null,
      emailNotifications: boolean,
      userPublic: boolean,
      role:  {
        id: string,
        name: string,
      },
    },
  } | null,
};

export interface UpdateUserMutationVariables {
  id: number,
  userInput: UserInput,
};

export interface UpdateUserMutation {
  // Update existing user
  updateUser:  {
    user:  {
      id: string,
      firstName: string,
      lastName: string,
      email: string,
      avatar: string | null,
      active: boolean,
      positionDescription: string | null,
      bio: string | null,
      emailNotifications: boolean,
      userPublic: boolean,
      role:  {
        id: string,
        name: string,
      },
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
    user:  {
      id: string,
      firstName: string,
      lastName: string,
      email: string,
      avatar: string | null,
      active: boolean,
      positionDescription: string | null,
      bio: string | null,
      emailNotifications: boolean,
      userPublic: boolean,
      role:  {
        id: string,
        name: string,
      },
    },
  } | null,
};

export interface UpdateUsersRankMutationVariables {
  orderedUserIds: Array< string >,
};

export interface UpdateUsersRankMutation {
  // Update rank (order of users on about us page)
  updateUsersRank:  {
    users:  Array< {
      id: string,
      rank: number | null,
    } >,
  } | null,
};

export interface DeleteUserMutationVariables {
  id: string,
};

export interface DeleteUserMutation {
  // Delete existing user
  deleteUser:  {
    id: string | null,
  } | null,
};

export interface CreateStatementMutationVariables {
  statementInput: CreateStatementInput,
};

export interface CreateStatementMutation {
  // Add new statement
  createStatement:  {
    statement:  {
      id: string,
      content: string,
      excerptedAt: string,
      important: boolean,
      speaker:  {
        id: string,
      },
      source:  {
        id: string,
        statementsCountsByEvaluationStatus:  Array< {
          evaluationStatus: string,
          statementsCount: number,
        } >,
      },
    },
  } | null,
};

export interface UpdateStatementMutationVariables {
  id: number,
  statementInput: UpdateStatementInput,
};

export interface UpdateStatementMutation {
  // Update existing statement
  updateStatement:  {
    statement:  {
      id: string,
      content: string,
      title: string | null,
      important: boolean,
      published: boolean,
      excerptedAt: string,
      speaker:  {
        id: string,
        firstName: string,
        lastName: string,
        avatar: string | null,
      },
      assessment:  {
        id: string,
        shortExplanation: string | null,
        explanationHtml: string | null,
        explanationSlatejson: GraphQLCustomScalar_JSON | null,
        evaluationStatus: string,
        evaluator:  {
          id: string,
          firstName: string,
          lastName: string,
        } | null,
        veracity:  {
          id: string,
          key: GraphQLCustomScalar_VeracityKey,
          name: string,
        } | null,
        promiseRating:  {
          id: string,
          key: PromiseRatingKey,
          name: string,
        } | null,
      },
      source:  {
        id: string,
        statementsCountsByEvaluationStatus:  Array< {
          evaluationStatus: string,
          statementsCount: number,
        } >,
      },
      commentsCount: number,
      tags:  Array< {
        id: string,
        name: string,
      } >,
    },
  } | null,
};

export interface DeleteStatementMutationVariables {
  id: string,
};

export interface DeleteStatementMutation {
  // Delete existing statement
  deleteStatement:  {
    id: string,
  } | null,
};

export interface CreateCommentMutationVariables {
  commentInput: CommentInput,
};

export interface CreateCommentMutation {
  // Add new comment
  createComment:  {
    comment:  {
      id: string,
      content: string,
      user:  {
        id: string,
        firstName: string,
        lastName: string,
      },
      createdAt: GraphQLCustomScalar_DateTime,
    },
  } | null,
};

export interface UpdateSourceStatementsOrderMutationVariables {
  id: string,
  input: UpdateSourceStatementsOrderInput,
};

export interface UpdateSourceStatementsOrderMutation {
  // Update order of statements in source
  updateSourceStatementsOrder:  {
    source:  {
      id: string,
    },
  } | null,
};

export interface PublishApprovedSourceStatementsMutationVariables {
  id: string,
};

export interface PublishApprovedSourceStatementsMutation {
  // Publish all approved statements from source
  publishApprovedSourceStatements:  {
    source:  {
      id: string,
      statements:  Array< {
        id: string,
        published: boolean,
      } >,
    },
  } | null,
};

export interface DeleteContentImageMutationVariables {
  id: string,
};

export interface DeleteContentImageMutation {
  // Delete existing content image
  deleteContentImage:  {
    id: string | null,
  } | null,
};

export interface UpdateNotificationMutationVariables {
  id: string,
  input: UpdateNotificationInput,
};

export interface UpdateNotificationMutation {
  // Update existing notification
  updateNotification:  {
    notification:  {
      id: string,
      readAt: GraphQLCustomScalar_DateTime | null,
    },
  } | null,
};

export interface MarkUnreadNotificationsAsReadMutation {
  // Mark all unread notifications of current user as read
  markUnreadNotificationsAsRead:  {
    notifications:  Array< {
      id: string,
      readAt: GraphQLCustomScalar_DateTime | null,
    } >,
  } | null,
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
    textHtml: string | null,
    textSlatejson: GraphQLCustomScalar_JSON | null,
  },
};

export interface GetArticleQueryVariables {
  id: string,
};

export interface GetArticleQuery {
  article:  {
    id: string,
    articleType: string,
    title: string,
    slug: string,
    perex: string | null,
    published: boolean,
    publishedAt: GraphQLCustomScalar_DateTime | null,
    illustration: string | null,
    segments:  Array< {
      id: string,
      segmentType: string,
      textHtml: string | null,
      textSlatejson: GraphQLCustomScalar_JSON | null,
      promiseUrl: string | null,
      source:  {
        id: string,
      } | null,
    } >,
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
    articleType: string,
    title: string,
    slug: string,
    published: boolean,
    publishedAt: GraphQLCustomScalar_DateTime | null,
  } >,
};

export interface GetMediaPersonalitiesQueryVariables {
  name?: string | null,
};

export interface GetMediaPersonalitiesQuery {
  mediaPersonalities:  Array< {
    id: string,
    name: string,
  } >,
};

export interface GetMediaPersonalityQueryVariables {
  id: string,
};

export interface GetMediaPersonalityQuery {
  mediaPersonality:  {
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
    sourceUrl: string | null,
    releasedAt: string,
    medium:  {
      id: string,
      name: string,
    },
    mediaPersonalities:  Array< {
      id: string,
      name: string,
    } >,
    statementsCountsByEvaluationStatus:  Array< {
      evaluationStatus: string,
      statementsCount: number,
    } >,
    statements:  Array< {
      id: string,
    } >,
    expert:  {
      id: string,
      firstName: string,
      lastName: string,
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
    sourceUrl: string | null,
    releasedAt: string,
    transcript: string | null,
    medium:  {
      id: string,
      name: string,
    },
    mediaPersonalities:  Array< {
      id: string,
      name: string,
    } >,
    statementsCountsByEvaluationStatus:  Array< {
      evaluationStatus: string,
      statementsCount: number,
    } >,
    speakers:  Array< {
      id: string,
      firstName: string,
      lastName: string,
    } >,
    expert:  {
      id: string,
      firstName: string,
      lastName: string,
    } | null,
  },
};

export interface GetSourcesForSelectQuery {
  sources:  Array< {
    id: string,
    name: string,
    releasedAt: string,
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
    statementType: StatementType,
    content: string,
    title: string | null,
    important: boolean,
    published: boolean,
    speaker:  {
      id: string,
      firstName: string,
      lastName: string,
      avatar: string | null,
    },
    assessment:  {
      id: string,
      assessmentMethodology:  {
        id: string,
        ratingModel: AssessmentMethodologyRatingModel,
        ratingKeys: Array< string >,
      },
      evaluationStatus: string,
      evaluator:  {
        id: string,
        firstName: string,
        lastName: string,
      } | null,
      veracity:  {
        id: string,
        key: GraphQLCustomScalar_VeracityKey,
        name: string,
      } | null,
      promiseRating:  {
        id: string,
        key: PromiseRatingKey,
        name: string,
      } | null,
      shortExplanation: string | null,
      shortExplanationCharactersLength: number,
      explanationCharactersLength: number,
    },
    statementTranscriptPosition:  {
      id: string,
      startLine: number,
      startOffset: number,
      endLine: number,
      endOffset: number,
    } | null,
    tags:  Array< {
      id: string,
      name: string,
    } >,
    commentsCount: number,
    sourceOrder: number | null,
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
    firstName: string,
    lastName: string,
    avatar: string | null,
    active: boolean,
    bio: string | null,
    positionDescription: string | null,
    emailNotifications: boolean,
    userPublic: boolean,
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
    firstName: string,
    lastName: string,
    avatar: string | null,
    active: boolean,
    bio: string | null,
    positionDescription: string | null,
    emailNotifications: boolean,
    userPublic: boolean,
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
    isParty: boolean,
    isInactive: boolean,
    shortName: string | null,
    foundedAt: string | null,
    terminatedAt: string | null,
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
    isParty: boolean,
    isInactive: boolean,
    shortName: string | null,
    foundedAt: string | null,
    terminatedAt: string | null,
  },
};

export interface GetSpeakerBodiesQuery {
  bodies:  Array< {
    id: string,
    name: string,
    shortName: string | null,
    isInactive: boolean,
    terminatedAt: string | null,
  } >,
};

export interface GetSpeakerQueryVariables {
  id: number,
};

export interface GetSpeakerQuery {
  speaker:  {
    id: string,
    firstName: string,
    lastName: string,
    websiteUrl: string,
    avatar: string | null,
    memberships:  Array< {
      id: string,
      body:  {
        id: string,
        shortName: string | null,
      },
      since: string | null,
      until: string | null,
    } > | null,
  },
};

export interface GetSpeakersQueryVariables {
  name?: string | null,
};

export interface GetSpeakersQuery {
  speakers:  Array< {
    id: string,
    firstName: string,
    lastName: string,
    avatar: string | null,
    websiteUrl: string,
    body:  {
      shortName: string | null,
    } | null,
    memberships:  Array< {
      id: string,
      body:  {
        id: string,
        shortName: string | null,
      },
      since: string | null,
      until: string | null,
    } > | null,
  } >,
};

export interface GetStatementQueryVariables {
  id: number,
};

export interface GetStatementQuery {
  statement:  {
    id: string,
    statementType: StatementType,
    content: string,
    title: string | null,
    important: boolean,
    published: boolean,
    excerptedAt: string,
    countInStatistics: boolean,
    speaker:  {
      id: string,
      firstName: string,
      lastName: string,
      avatar: string | null,
    },
    assessment:  {
      id: string,
      assessmentMethodology:  {
        id: string,
        ratingModel: AssessmentMethodologyRatingModel,
        ratingKeys: Array< string >,
      },
      explanationHtml: string | null,
      explanationSlatejson: GraphQLCustomScalar_JSON | null,
      shortExplanation: string | null,
      evaluationStatus: string,
      evaluator:  {
        id: string,
        firstName: string,
        lastName: string,
      } | null,
      veracity:  {
        id: string,
        key: GraphQLCustomScalar_VeracityKey,
        name: string,
      } | null,
      promiseRating:  {
        id: string,
        key: PromiseRatingKey,
        name: string,
      } | null,
    },
    source:  {
      id: string,
      name: string,
      sourceUrl: string | null,
      releasedAt: string,
      medium:  {
        id: string,
        name: string,
      },
      mediaPersonalities:  Array< {
        id: string,
        name: string,
      } >,
      expert:  {
        id: string,
        firstName: string,
        lastName: string,
      } | null,
    },
    statementTranscriptPosition:  {
      id: string,
    } | null,
    tags:  Array< {
      id: string,
      name: string,
    } >,
    commentsCount: number,
  },
};

export interface GetStatementCommentsQueryVariables {
  id: number,
};

export interface GetStatementCommentsQuery {
  statement:  {
    id: string,
    commentsCount: number,
    comments:  Array< {
      id: string,
      content: string,
      user:  {
        id: string,
        firstName: string,
        lastName: string,
      },
      createdAt: GraphQLCustomScalar_DateTime,
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
  currentUser:  {
    id: string,
    firstName: string,
    lastName: string,
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
  contentImages:  {
    totalCount: number,
    items:  Array< {
      id: string,
      image: string,
      image50x50: string,
      name: string,
      createdAt: GraphQLCustomScalar_DateTime,
      user:  {
        id: string,
        firstName: string,
        lastName: string,
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
    totalCount: number,
    items:  Array< {
      id: string,
      content: string,
      actionLink: string,
      actionText: string,
      createdAt: GraphQLCustomScalar_DateTime,
      readAt: GraphQLCustomScalar_DateTime | null,
    } >,
  },
};

export interface GetPromiseRatingsForSelectQuery {
  promiseRatings:  Array< {
    id: string,
    key: PromiseRatingKey,
    name: string,
  } >,
};

export interface GetTagsForSelectQueryVariables {
  forStatementType: StatementType,
};

export interface GetTagsForSelectQuery {
  tags:  Array< {
    id: string,
    name: string,
  } >,
};

export interface GetVeracitiesForSelectQuery {
  veracities:  Array< {
    id: string,
    key: GraphQLCustomScalar_VeracityKey,
    name: string,
  } >,
};

export interface GetUsersForSelectQueryVariables {
  roles?: Array< string > | null,
};

export interface GetUsersForSelectQuery {
  users:  Array< {
    id: string,
    firstName: string,
    lastName: string,
  } >,
};

export interface GetSpeakersForSelectQuery {
  speakers:  Array< {
    id: string,
    firstName: string,
    lastName: string,
  } >,
};

export interface GetMediaPersonalitiesForSelectQuery {
  mediaPersonalities:  Array< {
    id: string,
    name: string,
  } >,
};
