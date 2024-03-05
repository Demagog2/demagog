/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateMediaPersonality
// ====================================================

export interface CreateMediaPersonality_createMediaPersonality_mediaPersonality {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface CreateMediaPersonality_createMediaPersonality {
  __typename: "CreateMediaPersonalityPayload";
  mediaPersonality: CreateMediaPersonality_createMediaPersonality_mediaPersonality;
}

export interface CreateMediaPersonality {
  /**
   * Add new media personality
   */
  createMediaPersonality: CreateMediaPersonality_createMediaPersonality | null;
}

export interface CreateMediaPersonalityVariables {
  mediaPersonalityInput: MediaPersonalityInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateMediaPersonality
// ====================================================

export interface UpdateMediaPersonality_updateMediaPersonality_mediaPersonality {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface UpdateMediaPersonality_updateMediaPersonality {
  __typename: "UpdateMediaPersonalityPayload";
  mediaPersonality: UpdateMediaPersonality_updateMediaPersonality_mediaPersonality;
}

export interface UpdateMediaPersonality {
  /**
   * Update existing media personality
   */
  updateMediaPersonality: UpdateMediaPersonality_updateMediaPersonality | null;
}

export interface UpdateMediaPersonalityVariables {
  id: string;
  mediaPersonalityInput: MediaPersonalityInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteMediaPersonality
// ====================================================

export interface DeleteMediaPersonality_deleteMediaPersonality {
  __typename: "DeleteMediaPersonalityPayload";
  id: string;
}

export interface DeleteMediaPersonality {
  /**
   * Delete existing media personality
   */
  deleteMediaPersonality: DeleteMediaPersonality_deleteMediaPersonality | null;
}

export interface DeleteMediaPersonalityVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateMedium
// ====================================================

export interface CreateMedium_createMedium_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface CreateMedium_createMedium {
  __typename: "CreateMediumPayload";
  medium: CreateMedium_createMedium_medium;
}

export interface CreateMedium {
  /**
   * Add new medium
   */
  createMedium: CreateMedium_createMedium | null;
}

export interface CreateMediumVariables {
  mediumInput: MediumInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateMedium
// ====================================================

export interface UpdateMedium_updateMedium_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface UpdateMedium_updateMedium {
  __typename: "UpdateMediumPayload";
  medium: UpdateMedium_updateMedium_medium;
}

export interface UpdateMedium {
  /**
   * Update existing medium
   */
  updateMedium: UpdateMedium_updateMedium | null;
}

export interface UpdateMediumVariables {
  id: string;
  mediumInput: MediumInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteMedium
// ====================================================

export interface DeleteMedium_deleteMedium {
  __typename: "DeleteMediumPayload";
  id: string;
}

export interface DeleteMedium {
  /**
   * Delete existing medium
   */
  deleteMedium: DeleteMedium_deleteMedium | null;
}

export interface DeleteMediumVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePage
// ====================================================

export interface CreatePage_createPage_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  published: boolean;
  textHtml: string | null;
  textSlatejson: GraphQLCustomScalar_Json | null;
}

export interface CreatePage_createPage {
  __typename: "CreatePagePayload";
  page: CreatePage_createPage_page;
}

export interface CreatePage {
  /**
   * Add new page
   */
  createPage: CreatePage_createPage | null;
}

export interface CreatePageVariables {
  pageInput: PageInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePage
// ====================================================

export interface UpdatePage_updatePage_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  published: boolean;
  textHtml: string | null;
  textSlatejson: GraphQLCustomScalar_Json | null;
}

export interface UpdatePage_updatePage {
  __typename: "UpdatePagePayload";
  page: UpdatePage_updatePage_page;
}

export interface UpdatePage {
  /**
   * Update existing page
   */
  updatePage: UpdatePage_updatePage | null;
}

export interface UpdatePageVariables {
  id: string;
  pageInput: PageInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePage
// ====================================================

export interface DeletePage_deletePage {
  __typename: "DeletePagePayload";
  id: string | null;
}

export interface DeletePage {
  /**
   * Delete existing page
   */
  deletePage: DeletePage_deletePage | null;
}

export interface DeletePageVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateArticle
// ====================================================

export interface CreateArticle_createArticle_article_segments_statements {
  __typename: "Statement";
  id: string;
}

export interface CreateArticle_createArticle_article_segments {
  __typename: "ArticleSegment";
  id: string;
  /**
   * Can be: source_statements, single_statement, promise or text
   */
  segmentType: string;
  /**
   * If text segment type, returns the text in HTML for this segment
   */
  textHtml: string | null;
  /**
   * If text segment type, returns the text in JSON for this segment
   */
  textSlatejson: GraphQLCustomScalar_Json | null;
  /**
   * If promise segment type, returns the url of promise for this segment
   */
  promiseUrl: string | null;
  /**
   * If single_statement segment type, returns the ID of statement for this segment
   */
  statementId: string | null;
  /**
   * If source_statements or single_statement segment type, returns the statements for this segment
   */
  statements: CreateArticle_createArticle_article_segments_statements[];
}

export interface CreateArticle_createArticle_article_source {
  __typename: "Source";
  id: string;
}

export interface CreateArticle_createArticle_article_articleTags {
  __typename: "ArticleTag";
  id: string;
}

export interface CreateArticle_createArticle_article {
  __typename: "Article";
  id: string;
  articleType: string;
  title: string;
  titleEn: string | null;
  slug: string;
  perex: string | null;
  published: boolean;
  publishedAt: GraphQLCustomScalar_DateTime | null;
  illustration: string | null;
  segments: CreateArticle_createArticle_article_segments[];
  source: CreateArticle_createArticle_article_source | null;
  articleTags: CreateArticle_createArticle_article_articleTags[];
}

export interface CreateArticle_createArticle {
  __typename: "CreateArticlePayload";
  article: CreateArticle_createArticle_article;
}

export interface CreateArticle {
  /**
   * Add new article
   */
  createArticle: CreateArticle_createArticle | null;
}

export interface CreateArticleVariables {
  articleInput: ArticleInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateArticle
// ====================================================

export interface UpdateArticle_updateArticle_article_segments_statements {
  __typename: "Statement";
  id: string;
}

export interface UpdateArticle_updateArticle_article_segments {
  __typename: "ArticleSegment";
  id: string;
  /**
   * Can be: source_statements, single_statement, promise or text
   */
  segmentType: string;
  /**
   * If text segment type, returns the text in HTML for this segment
   */
  textHtml: string | null;
  /**
   * If text segment type, returns the text in JSON for this segment
   */
  textSlatejson: GraphQLCustomScalar_Json | null;
  /**
   * If promise segment type, returns the url of promise for this segment
   */
  promiseUrl: string | null;
  /**
   * If single_statement segment type, returns the ID of statement for this segment
   */
  statementId: string | null;
  /**
   * If source_statements or single_statement segment type, returns the statements for this segment
   */
  statements: UpdateArticle_updateArticle_article_segments_statements[];
}

export interface UpdateArticle_updateArticle_article_source {
  __typename: "Source";
  id: string;
}

export interface UpdateArticle_updateArticle_article_articleTags {
  __typename: "ArticleTag";
  id: string;
}

export interface UpdateArticle_updateArticle_article {
  __typename: "Article";
  id: string;
  articleType: string;
  title: string;
  titleEn: string | null;
  slug: string;
  perex: string | null;
  published: boolean;
  publishedAt: GraphQLCustomScalar_DateTime | null;
  illustration: string | null;
  segments: UpdateArticle_updateArticle_article_segments[];
  source: UpdateArticle_updateArticle_article_source | null;
  articleTags: UpdateArticle_updateArticle_article_articleTags[];
}

export interface UpdateArticle_updateArticle {
  __typename: "UpdateArticlePayload";
  article: UpdateArticle_updateArticle_article;
}

export interface UpdateArticle {
  /**
   * Update existing article
   */
  updateArticle: UpdateArticle_updateArticle | null;
}

export interface UpdateArticleVariables {
  id: string;
  articleInput: ArticleInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteArticle
// ====================================================

export interface DeleteArticle_deleteArticle {
  __typename: "DeleteArticlePayload";
  id: string | null;
}

export interface DeleteArticle {
  /**
   * Delete existing article
   */
  deleteArticle: DeleteArticle_deleteArticle | null;
}

export interface DeleteArticleVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSource
// ====================================================

export interface CreateSource_createSource_source {
  __typename: "Source";
  id: string;
  name: string;
}

export interface CreateSource_createSource {
  __typename: "CreateSourcePayload";
  source: CreateSource_createSource_source;
}

export interface CreateSource {
  /**
   * Add new source
   */
  createSource: CreateSource_createSource | null;
}

export interface CreateSourceVariables {
  sourceInput: SourceInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSource
// ====================================================

export interface UpdateSource_updateSource_source {
  __typename: "Source";
  id: string;
  name: string;
}

export interface UpdateSource_updateSource {
  __typename: "UpdateSourcePayload";
  source: UpdateSource_updateSource_source;
}

export interface UpdateSource {
  /**
   * Update existing source
   */
  updateSource: UpdateSource_updateSource | null;
}

export interface UpdateSourceVariables {
  id: string;
  sourceInput: SourceInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSource
// ====================================================

export interface DeleteSource_deleteSource {
  __typename: "DeleteSourcePayload";
  id: string;
}

export interface DeleteSource {
  /**
   * Delete existing source and all it's statements
   */
  deleteSource: DeleteSource_deleteSource | null;
}

export interface DeleteSourceVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateBody
// ====================================================

export interface CreateBody_createBody_body {
  __typename: "Body";
  id: string;
  logo: string | null;
  name: string;
  isParty: boolean;
  isInactive: boolean;
  shortName: string | null;
  link: string | null;
  foundedAt: string | null;
  terminatedAt: string | null;
}

export interface CreateBody_createBody {
  __typename: "CreateBodyPayload";
  body: CreateBody_createBody_body;
}

export interface CreateBody {
  /**
   * Create new body
   */
  createBody: CreateBody_createBody | null;
}

export interface CreateBodyVariables {
  bodyInput: BodyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateBody
// ====================================================

export interface UpdateBody_updateBody_body {
  __typename: "Body";
  id: string;
  logo: string | null;
  name: string;
  isParty: boolean;
  isInactive: boolean;
  shortName: string | null;
  link: string | null;
  foundedAt: string | null;
  terminatedAt: string | null;
}

export interface UpdateBody_updateBody {
  __typename: "UpdateBodyPayload";
  body: UpdateBody_updateBody_body;
}

export interface UpdateBody {
  /**
   * Update existing body
   */
  updateBody: UpdateBody_updateBody | null;
}

export interface UpdateBodyVariables {
  id: number;
  bodyInput: BodyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteBody
// ====================================================

export interface DeleteBody_deleteBody {
  __typename: "DeleteBodyPayload";
  id: string;
}

export interface DeleteBody {
  /**
   * Delete existing body
   */
  deleteBody: DeleteBody_deleteBody | null;
}

export interface DeleteBodyVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSpeaker
// ====================================================

export interface CreateSpeaker_createSpeaker_speaker_body {
  __typename: "Body";
  id: string;
  shortName: string | null;
}

export interface CreateSpeaker_createSpeaker_speaker_memberships_body {
  __typename: "Body";
  id: string;
  shortName: string | null;
}

export interface CreateSpeaker_createSpeaker_speaker_memberships {
  __typename: "Membership";
  id: string;
  body: CreateSpeaker_createSpeaker_speaker_memberships_body;
  since: string | null;
  until: string | null;
}

export interface CreateSpeaker_createSpeaker_speaker {
  __typename: "Speaker";
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  websiteUrl: string;
  /**
   * Temporary IDs from Hlidac statu, please use Wikidata ID instead
   */
  osobaId: string | null;
  wikidataId: string | null;
  role: string | null;
  body: CreateSpeaker_createSpeaker_speaker_body | null;
  memberships: CreateSpeaker_createSpeaker_speaker_memberships[] | null;
}

export interface CreateSpeaker_createSpeaker {
  __typename: "CreateSpeakerPayload";
  speaker: CreateSpeaker_createSpeaker_speaker;
}

export interface CreateSpeaker {
  /**
   * Add new speaker
   */
  createSpeaker: CreateSpeaker_createSpeaker | null;
}

export interface CreateSpeakerVariables {
  speakerInput: SpeakerInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSpeaker
// ====================================================

export interface UpdateSpeaker_updateSpeaker_speaker_body {
  __typename: "Body";
  id: string;
  shortName: string | null;
}

export interface UpdateSpeaker_updateSpeaker_speaker_memberships_body {
  __typename: "Body";
  id: string;
  shortName: string | null;
}

export interface UpdateSpeaker_updateSpeaker_speaker_memberships {
  __typename: "Membership";
  id: string;
  body: UpdateSpeaker_updateSpeaker_speaker_memberships_body;
  since: string | null;
  until: string | null;
}

export interface UpdateSpeaker_updateSpeaker_speaker {
  __typename: "Speaker";
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  websiteUrl: string;
  /**
   * Temporary IDs from Hlidac statu, please use Wikidata ID instead
   */
  osobaId: string | null;
  wikidataId: string | null;
  role: string | null;
  body: UpdateSpeaker_updateSpeaker_speaker_body | null;
  memberships: UpdateSpeaker_updateSpeaker_speaker_memberships[] | null;
}

export interface UpdateSpeaker_updateSpeaker {
  __typename: "UpdateSpeakerPayload";
  speaker: UpdateSpeaker_updateSpeaker_speaker;
}

export interface UpdateSpeaker {
  /**
   * Update existing speaker
   */
  updateSpeaker: UpdateSpeaker_updateSpeaker | null;
}

export interface UpdateSpeakerVariables {
  id: string;
  speakerInput: SpeakerInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSpeaker
// ====================================================

export interface DeleteSpeaker_deleteSpeaker {
  __typename: "DeleteSpeakerPayload";
  id: string;
}

export interface DeleteSpeaker {
  /**
   * Delete existing speaker
   */
  deleteSpeaker: DeleteSpeaker_deleteSpeaker | null;
}

export interface DeleteSpeakerVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUser
// ====================================================

export interface CreateUser_createUser_user_role {
  __typename: "Role";
  id: string;
  name: string;
}

export interface CreateUser_createUser_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  active: boolean;
  positionDescription: string | null;
  bio: string | null;
  emailNotifications: boolean;
  userPublic: boolean;
  role: CreateUser_createUser_user_role;
}

export interface CreateUser_createUser {
  __typename: "CreateUserPayload";
  user: CreateUser_createUser_user;
}

export interface CreateUser {
  /**
   * Add new user
   */
  createUser: CreateUser_createUser | null;
}

export interface CreateUserVariables {
  userInput: UserInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser_user_role {
  __typename: "Role";
  id: string;
  name: string;
}

export interface UpdateUser_updateUser_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  active: boolean;
  positionDescription: string | null;
  bio: string | null;
  emailNotifications: boolean;
  userPublic: boolean;
  role: UpdateUser_updateUser_user_role;
}

export interface UpdateUser_updateUser {
  __typename: "UpdateUserPayload";
  user: UpdateUser_updateUser_user;
}

export interface UpdateUser {
  /**
   * Update existing user
   */
  updateUser: UpdateUser_updateUser | null;
}

export interface UpdateUserVariables {
  id: number;
  userInput: UserInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserActiveness
// ====================================================

export interface UpdateUserActiveness_updateUserActiveness_user {
  __typename: "User";
  id: string;
  active: boolean;
}

export interface UpdateUserActiveness_updateUserActiveness {
  __typename: "UpdateUserActivenessPayload";
  user: UpdateUserActiveness_updateUserActiveness_user;
}

export interface UpdateUserActiveness {
  /**
   * Toggle user active. Inactive user cannot access the system.
   */
  updateUserActiveness: UpdateUserActiveness_updateUserActiveness | null;
}

export interface UpdateUserActivenessVariables {
  id: number;
  userActive: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUsersRank
// ====================================================

export interface UpdateUsersRank_updateUsersRank_users {
  __typename: "User";
  id: string;
  rank: number | null;
}

export interface UpdateUsersRank_updateUsersRank {
  __typename: "UpdateUsersRankPayload";
  users: UpdateUsersRank_updateUsersRank_users[];
}

export interface UpdateUsersRank {
  /**
   * Update rank (order of users on about us page)
   */
  updateUsersRank: UpdateUsersRank_updateUsersRank | null;
}

export interface UpdateUsersRankVariables {
  orderedUserIds: string[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteUser
// ====================================================

export interface DeleteUser_deleteUser {
  __typename: "DeleteUserPayload";
  id: string | null;
}

export interface DeleteUser {
  /**
   * Delete existing user
   */
  deleteUser: DeleteUser_deleteUser | null;
}

export interface DeleteUserVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateStatement
// ====================================================

export interface CreateStatement_createStatement_statement_sourceSpeaker {
  __typename: "SourceSpeaker";
  id: string;
}

export interface CreateStatement_createStatement_statement_source_statementsCountsByEvaluationStatus {
  __typename: "StatementsCountsByEvaluationStatusItem";
  evaluationStatus: string;
  statementsCount: number;
}

export interface CreateStatement_createStatement_statement_source {
  __typename: "Source";
  id: string;
  statementsCountsByEvaluationStatus: CreateStatement_createStatement_statement_source_statementsCountsByEvaluationStatus[];
}

export interface CreateStatement_createStatement_statement {
  __typename: "Statement";
  id: string;
  content: string;
  excerptedAt: string;
  important: boolean;
  sourceSpeaker: CreateStatement_createStatement_statement_sourceSpeaker;
  source: CreateStatement_createStatement_statement_source;
}

export interface CreateStatement_createStatement {
  __typename: "CreateStatementPayload";
  statement: CreateStatement_createStatement_statement;
}

export interface CreateStatement {
  /**
   * Add new statement
   */
  createStatement: CreateStatement_createStatement | null;
}

export interface CreateStatementVariables {
  statementInput: CreateStatementInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateStatement
// ====================================================

export interface UpdateStatement_updateStatement_statement_sourceSpeaker_speaker {
  __typename: "Speaker";
  id: string;
  avatar: string | null;
}

export interface UpdateStatement_updateStatement_statement_sourceSpeaker {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  role: string | null;
  speaker: UpdateStatement_updateStatement_statement_sourceSpeaker_speaker;
}

export interface UpdateStatement_updateStatement_statement_assessment_evaluator {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface UpdateStatement_updateStatement_statement_assessment_veracity {
  __typename: "Veracity";
  id: string;
  key: GraphQLCustomScalar_VeracityKey;
  name: string;
}

export interface UpdateStatement_updateStatement_statement_assessment_promiseRating {
  __typename: "PromiseRating";
  id: string;
  key: PromiseRatingKey;
  name: string;
}

export interface UpdateStatement_updateStatement_statement_assessment {
  __typename: "Assessment";
  id: string;
  shortExplanation: string | null;
  explanationHtml: string | null;
  explanationSlatejson: GraphQLCustomScalar_Json | null;
  evaluationStatus: string;
  evaluator: UpdateStatement_updateStatement_statement_assessment_evaluator | null;
  veracity: UpdateStatement_updateStatement_statement_assessment_veracity | null;
  promiseRating: UpdateStatement_updateStatement_statement_assessment_promiseRating | null;
}

export interface UpdateStatement_updateStatement_statement_source_statementsCountsByEvaluationStatus {
  __typename: "StatementsCountsByEvaluationStatusItem";
  evaluationStatus: string;
  statementsCount: number;
}

export interface UpdateStatement_updateStatement_statement_source {
  __typename: "Source";
  id: string;
  statementsCountsByEvaluationStatus: UpdateStatement_updateStatement_statement_source_statementsCountsByEvaluationStatus[];
}

export interface UpdateStatement_updateStatement_statement_tags {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface UpdateStatement_updateStatement_statement_articleTags {
  __typename: "ArticleTag";
  id: string;
}

export interface UpdateStatement_updateStatement_statement {
  __typename: "Statement";
  id: string;
  content: string;
  title: string | null;
  important: boolean;
  published: boolean;
  excerptedAt: string;
  sourceSpeaker: UpdateStatement_updateStatement_statement_sourceSpeaker;
  assessment: UpdateStatement_updateStatement_statement_assessment;
  source: UpdateStatement_updateStatement_statement_source;
  commentsCount: number;
  tags: UpdateStatement_updateStatement_statement_tags[];
  articleTags: UpdateStatement_updateStatement_statement_articleTags[];
}

export interface UpdateStatement_updateStatement {
  __typename: "UpdateStatementPayload";
  statement: UpdateStatement_updateStatement_statement;
}

export interface UpdateStatement {
  /**
   * Update existing statement
   */
  updateStatement: UpdateStatement_updateStatement | null;
}

export interface UpdateStatementVariables {
  id: number;
  statementInput: UpdateStatementInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteStatement
// ====================================================

export interface DeleteStatement_deleteStatement {
  __typename: "DeleteStatementPayload";
  id: string;
}

export interface DeleteStatement {
  /**
   * Delete existing statement
   */
  deleteStatement: DeleteStatement_deleteStatement | null;
}

export interface DeleteStatementVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateComment
// ====================================================

export interface CreateComment_createComment_comment_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface CreateComment_createComment_comment {
  __typename: "Comment";
  id: string;
  content: string;
  user: CreateComment_createComment_comment_user;
  createdAt: GraphQLCustomScalar_DateTime;
}

export interface CreateComment_createComment {
  __typename: "CreateCommentPayload";
  comment: CreateComment_createComment_comment;
}

export interface CreateComment {
  /**
   * Add new comment
   */
  createComment: CreateComment_createComment | null;
}

export interface CreateCommentVariables {
  commentInput: CommentInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSourceStatementsOrder
// ====================================================

export interface UpdateSourceStatementsOrder_updateSourceStatementsOrder_source {
  __typename: "Source";
  id: string;
}

export interface UpdateSourceStatementsOrder_updateSourceStatementsOrder {
  __typename: "UpdateSourceStatementsOrderPayload";
  source: UpdateSourceStatementsOrder_updateSourceStatementsOrder_source;
}

export interface UpdateSourceStatementsOrder {
  /**
   * Update order of statements in source
   */
  updateSourceStatementsOrder: UpdateSourceStatementsOrder_updateSourceStatementsOrder | null;
}

export interface UpdateSourceStatementsOrderVariables {
  id: string;
  input: UpdateSourceStatementsOrderInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PublishApprovedSourceStatements
// ====================================================

export interface PublishApprovedSourceStatements_publishApprovedSourceStatements_source_statements {
  __typename: "Statement";
  id: string;
  published: boolean;
}

export interface PublishApprovedSourceStatements_publishApprovedSourceStatements_source {
  __typename: "Source";
  id: string;
  statements: PublishApprovedSourceStatements_publishApprovedSourceStatements_source_statements[];
}

export interface PublishApprovedSourceStatements_publishApprovedSourceStatements {
  __typename: "PublishApprovedSourceStatementsPayload";
  source: PublishApprovedSourceStatements_publishApprovedSourceStatements_source;
}

export interface PublishApprovedSourceStatements {
  /**
   * Publish all approved statements from source
   */
  publishApprovedSourceStatements: PublishApprovedSourceStatements_publishApprovedSourceStatements | null;
}

export interface PublishApprovedSourceStatementsVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteContentImage
// ====================================================

export interface DeleteContentImage_deleteContentImage {
  __typename: "DeleteContentImagePayload";
  id: string | null;
}

export interface DeleteContentImage {
  /**
   * Delete existing content image
   */
  deleteContentImage: DeleteContentImage_deleteContentImage | null;
}

export interface DeleteContentImageVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateNotification
// ====================================================

export interface UpdateNotification_updateNotification_notification {
  __typename: "Notification";
  id: string;
  readAt: GraphQLCustomScalar_DateTime | null;
}

export interface UpdateNotification_updateNotification {
  __typename: "UpdateNotificationPayload";
  notification: UpdateNotification_updateNotification_notification;
}

export interface UpdateNotification {
  /**
   * Update existing notification
   */
  updateNotification: UpdateNotification_updateNotification | null;
}

export interface UpdateNotificationVariables {
  id: string;
  input: UpdateNotificationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkUnreadNotificationsAsRead
// ====================================================

export interface MarkUnreadNotificationsAsRead_markUnreadNotificationsAsRead_notifications {
  __typename: "Notification";
  id: string;
  readAt: GraphQLCustomScalar_DateTime | null;
}

export interface MarkUnreadNotificationsAsRead_markUnreadNotificationsAsRead {
  __typename: "MarkUnreadNotificationsAsReadPayload";
  notifications: MarkUnreadNotificationsAsRead_markUnreadNotificationsAsRead_notifications[];
}

export interface MarkUnreadNotificationsAsRead {
  /**
   * Mark unread notifications of current user as read, either all or just regarding one statement
   */
  markUnreadNotificationsAsRead: MarkUnreadNotificationsAsRead_markUnreadNotificationsAsRead | null;
}

export interface MarkUnreadNotificationsAsReadVariables {
  statementId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSourceVideoFields
// ====================================================

export interface UpdateSourceVideoFields_updateSourceVideoFields_source {
  __typename: "Source";
  id: string;
  videoType: string | null;
  videoId: string | null;
}

export interface UpdateSourceVideoFields_updateSourceVideoFields {
  __typename: "UpdateSourceVideoFieldsPayload";
  source: UpdateSourceVideoFields_updateSourceVideoFields_source;
}

export interface UpdateSourceVideoFields {
  /**
   * Update source video fields
   */
  updateSourceVideoFields: UpdateSourceVideoFields_updateSourceVideoFields | null;
}

export interface UpdateSourceVideoFieldsVariables {
  id: string;
  sourceVideoFieldsInput: SourceInputVideoFields;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateStatementsVideoMarks
// ====================================================

export interface UpdateStatementsVideoMarks_updateStatementsVideoMarks_statements_statementVideoMark {
  __typename: "StatementVideoMark";
  id: string;
  start: number;
  stop: number;
}

export interface UpdateStatementsVideoMarks_updateStatementsVideoMarks_statements {
  __typename: "Statement";
  id: string;
  statementVideoMark: UpdateStatementsVideoMarks_updateStatementsVideoMarks_statements_statementVideoMark | null;
}

export interface UpdateStatementsVideoMarks_updateStatementsVideoMarks {
  __typename: "UpdateStatementsVideoMarksPayload";
  statements: UpdateStatementsVideoMarks_updateStatementsVideoMarks_statements[];
}

export interface UpdateStatementsVideoMarks {
  /**
   * Update video marks for given statements
   */
  updateStatementsVideoMarks: UpdateStatementsVideoMarks_updateStatementsVideoMarks | null;
}

export interface UpdateStatementsVideoMarksVariables {
  id: string;
  statementsVideoMarksInput: StatementsVideoMarksInput[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateWebContent
// ====================================================

export interface UpdateWebContent_updateWebContent_webContent {
  __typename: "WebContent";
  id: string;
  systemId: string;
  name: string;
  urlPath: string;
  dynamicPage: boolean;
  dynamicPagePublished: boolean;
  structure: GraphQLCustomScalar_JSON;
  data: GraphQLCustomScalar_JSON;
}

export interface UpdateWebContent_updateWebContent {
  __typename: "UpdateWebContentPayload";
  webContent: UpdateWebContent_updateWebContent_webContent;
}

export interface UpdateWebContent {
  /**
   * Update web content
   */
  updateWebContent: UpdateWebContent_updateWebContent | null;
}

export interface UpdateWebContentVariables {
  id: string;
  webContentInput: WebContentInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTag
// ====================================================

export interface CreateTag_createTag_tag {
  __typename: "Tag";
  name: string;
}

export interface CreateTag_createTag {
  __typename: "CreateTagPayload";
  tag: CreateTag_createTag_tag;
}

export interface CreateTag {
  /**
   * Add new tag
   */
  createTag: CreateTag_createTag | null;
}

export interface CreateTagVariables {
  tagInput: TagInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateArticleTag
// ====================================================

export interface CreateArticleTag_createArticleTag_articleTag {
  __typename: "ArticleTag";
  title: string | null;
  slug: string;
  description: string | null;
  icon: string;
  published: boolean | null;
  stats: string | null;
  order: string;
  video: string | null;
}

export interface CreateArticleTag_createArticleTag {
  __typename: "CreateArticleTagPayload";
  articleTag: CreateArticleTag_createArticleTag_articleTag;
}

export interface CreateArticleTag {
  /**
   * Add new tag
   */
  createArticleTag: CreateArticleTag_createArticleTag | null;
}

export interface CreateArticleTagVariables {
  articleTagInput: ArticleTagInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateArticleTag
// ====================================================

export interface UpdateArticleTag_updateArticleTag_articleTag {
  __typename: "ArticleTag";
  title: string | null;
  slug: string;
  description: string | null;
  icon: string;
  published: boolean | null;
  stats: string | null;
  order: string;
  video: string | null;
}

export interface UpdateArticleTag_updateArticleTag {
  __typename: "UpdateArticleTagPayload";
  articleTag: UpdateArticleTag_updateArticleTag_articleTag;
}

export interface UpdateArticleTag {
  /**
   * Update existing article tag
   */
  updateArticleTag: UpdateArticleTag_updateArticleTag | null;
}

export interface UpdateArticleTagVariables {
  id: number;
  articleTagInput: ArticleTagInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteArticleTag
// ====================================================

export interface DeleteArticleTag_deleteArticleTag {
  __typename: "DeleteArticleTagPayload";
  id: string | null;
}

export interface DeleteArticleTag {
  /**
   * Delete existing article tag
   */
  deleteArticleTag: DeleteArticleTag_deleteArticleTag | null;
}

export interface DeleteArticleTagVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPages
// ====================================================

export interface GetPages_pages {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  published: boolean;
}

export interface GetPages {
  pages: GetPages_pages[];
}

export interface GetPagesVariables {
  title?: string | null;
  offset?: number | null;
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPage
// ====================================================

export interface GetPage_page {
  __typename: "Page";
  id: string;
  title: string;
  slug: string;
  published: boolean;
  textHtml: string | null;
  textSlatejson: GraphQLCustomScalar_Json | null;
}

export interface GetPage {
  page: GetPage_page;
}

export interface GetPageVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticle
// ====================================================

export interface GetArticle_article_segments_source {
  __typename: "Source";
  id: string;
}

export interface GetArticle_article_segments {
  __typename: "ArticleSegment";
  id: string;
  /**
   * Can be: source_statements, single_statement, promise or text
   */
  segmentType: string;
  /**
   * If text segment type, returns the text in HTML for this segment
   */
  textHtml: string | null;
  /**
   * If text segment type, returns the text in JSON for this segment
   */
  textSlatejson: GraphQLCustomScalar_Json | null;
  /**
   * If promise segment type, returns the url of promise for this segment
   */
  promiseUrl: string | null;
  /**
   * If single_statement segment type, returns the ID of statement for this segment
   */
  statementId: string | null;
  /**
   * If source_statements segment type, returns the source from which we take the statements for this segment
   */
  source: GetArticle_article_segments_source | null;
}

export interface GetArticle_article_source {
  __typename: "Source";
  id: string;
}

export interface GetArticle_article_articleTags {
  __typename: "ArticleTag";
  id: string;
  title: string | null;
}

export interface GetArticle_article_assessmentMethodology {
  __typename: "AssessmentMethodology";
  id: string;
}

export interface GetArticle_article {
  __typename: "Article";
  id: string;
  efcsnExternalId: string | null;
  efcsnCreatedAt: GraphQLCustomScalar_DateTime | null;
  articleType: string;
  title: string;
  titleEn: string | null;
  slug: string;
  perex: string | null;
  published: boolean;
  publishedAt: GraphQLCustomScalar_DateTime | null;
  illustration: string | null;
  segments: GetArticle_article_segments[];
  source: GetArticle_article_source | null;
  articleTags: GetArticle_article_articleTags[];
  assessmentMethodology: GetArticle_article_assessmentMethodology | null;
}

export interface GetArticle {
  article: GetArticle_article;
}

export interface GetArticleVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticles
// ====================================================

export interface GetArticles_articles {
  __typename: "Article";
  id: string;
  articleType: string;
  title: string;
  titleEn: string | null;
  slug: string;
  published: boolean;
  publishedAt: GraphQLCustomScalar_DateTime | null;
}

export interface GetArticles {
  articles: GetArticles_articles[];
}

export interface GetArticlesVariables {
  title?: string | null;
  offset?: number | null;
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMediaPersonalities
// ====================================================

export interface GetMediaPersonalities_mediaPersonalities {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface GetMediaPersonalities {
  mediaPersonalities: GetMediaPersonalities_mediaPersonalities[];
}

export interface GetMediaPersonalitiesVariables {
  name?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMediaPersonality
// ====================================================

export interface GetMediaPersonality_mediaPersonality {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface GetMediaPersonality {
  mediaPersonality: GetMediaPersonality_mediaPersonality;
}

export interface GetMediaPersonalityVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMedia
// ====================================================

export interface GetMedia_media {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface GetMedia {
  media: GetMedia_media[];
}

export interface GetMediaVariables {
  name?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMedium
// ====================================================

export interface GetMedium_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface GetMedium {
  medium: GetMedium_medium;
}

export interface GetMediumVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSources
// ====================================================

export interface GetSources_sources_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface GetSources_sources_mediaPersonalities {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface GetSources_sources_statementsCountsByEvaluationStatus {
  __typename: "StatementsCountsByEvaluationStatusItem";
  evaluationStatus: string;
  statementsCount: number;
}

export interface GetSources_sources_statements {
  __typename: "Statement";
  id: string;
}

export interface GetSources_sources_experts {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetSources_sources {
  __typename: "Source";
  id: string;
  name: string;
  sourceUrl: string | null;
  releasedAt: string | null;
  medium: GetSources_sources_medium | null;
  mediaPersonalities: GetSources_sources_mediaPersonalities[] | null;
  statementsCountsByEvaluationStatus: GetSources_sources_statementsCountsByEvaluationStatus[];
  statements: GetSources_sources_statements[];
  experts: GetSources_sources_experts[] | null;
}

export interface GetSources {
  sources: GetSources_sources[];
}

export interface GetSourcesVariables {
  name?: string | null;
  offset?: number | null;
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSource
// ====================================================

export interface GetSource_source_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface GetSource_source_mediaPersonalities {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface GetSource_source_statementsCountsByEvaluationStatus {
  __typename: "StatementsCountsByEvaluationStatusItem";
  evaluationStatus: string;
  statementsCount: number;
}

export interface GetSource_source_sourceSpeakers_speaker {
  __typename: "Speaker";
  id: string;
  avatar: string | null;
}

export interface GetSource_source_sourceSpeakers_body {
  __typename: "Body";
  id: string;
}

export interface GetSource_source_sourceSpeakers {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  role: string | null;
  speaker: GetSource_source_sourceSpeakers_speaker;
  body: GetSource_source_sourceSpeakers_body | null;
}

export interface GetSource_source_experts {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetSource_source {
  __typename: "Source";
  id: string;
  name: string;
  sourceUrl: string | null;
  releasedAt: string | null;
  transcript: string | null;
  medium: GetSource_source_medium | null;
  mediaPersonalities: GetSource_source_mediaPersonalities[] | null;
  statementsCountsByEvaluationStatus: GetSource_source_statementsCountsByEvaluationStatus[];
  sourceSpeakers: GetSource_source_sourceSpeakers[] | null;
  experts: GetSource_source_experts[] | null;
}

export interface GetSource {
  source: GetSource_source;
}

export interface GetSourceVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSourceDetail
// ====================================================

export interface GetSourceDetail_source_sourceSpeakers_speaker {
  __typename: "Speaker";
  id: string;
}

export interface GetSourceDetail_source_sourceSpeakers_body {
  __typename: "Body";
  id: string;
}

export interface GetSourceDetail_source_sourceSpeakers {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  role: string | null;
  speaker: GetSourceDetail_source_sourceSpeakers_speaker;
  body: GetSourceDetail_source_sourceSpeakers_body | null;
}

export interface GetSourceDetail_source_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface GetSourceDetail_source_mediaPersonalities {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface GetSourceDetail_source_experts {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetSourceDetail_source {
  __typename: "Source";
  id: string;
  name: string;
  sourceUrl: string | null;
  releasedAt: string | null;
  sourceSpeakers: GetSourceDetail_source_sourceSpeakers[] | null;
  medium: GetSourceDetail_source_medium | null;
  mediaPersonalities: GetSourceDetail_source_mediaPersonalities[] | null;
  experts: GetSourceDetail_source_experts[] | null;
}

export interface GetSourceDetail_statements_sourceSpeaker_speaker {
  __typename: "Speaker";
  id: string;
}

export interface GetSourceDetail_statements_sourceSpeaker {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  speaker: GetSourceDetail_statements_sourceSpeaker_speaker;
}

export interface GetSourceDetail_statements_assessment_assessmentMethodology {
  __typename: "AssessmentMethodology";
  id: string;
  ratingModel: AssessmentMethodologyRatingModel;
  ratingKeys: string[];
}

export interface GetSourceDetail_statements_assessment_evaluator {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetSourceDetail_statements_assessment_veracity {
  __typename: "Veracity";
  id: string;
  key: GraphQLCustomScalar_VeracityKey;
  name: string;
}

export interface GetSourceDetail_statements_assessment_promiseRating {
  __typename: "PromiseRating";
  id: string;
  key: PromiseRatingKey;
  name: string;
}

export interface GetSourceDetail_statements_assessment {
  __typename: "Assessment";
  id: string;
  explanationCharactersLength: number;
  shortExplanationCharactersLength: number;
  assessmentMethodology: GetSourceDetail_statements_assessment_assessmentMethodology;
  evaluator: GetSourceDetail_statements_assessment_evaluator | null;
  evaluationStatus: string;
  veracity: GetSourceDetail_statements_assessment_veracity | null;
  promiseRating: GetSourceDetail_statements_assessment_promiseRating | null;
}

export interface GetSourceDetail_statements {
  __typename: "Statement";
  id: string;
  content: string;
  published: boolean;
  commentsCount: number;
  sourceSpeaker: GetSourceDetail_statements_sourceSpeaker;
  assessment: GetSourceDetail_statements_assessment;
}

export interface GetSourceDetail {
  source: GetSourceDetail_source;
  statements: GetSourceDetail_statements[];
}

export interface GetSourceDetailVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSourceInternalStats
// ====================================================

export interface GetSourceInternalStats_source {
  __typename: "Source";
  id: string;
  internalStats: GraphQLCustomScalar_JSON;
}

export interface GetSourceInternalStats {
  source: GetSourceInternalStats_source;
}

export interface GetSourceInternalStatsVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSourcesForSelect
// ====================================================

export interface GetSourcesForSelect_sources_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface GetSourcesForSelect_sources {
  __typename: "Source";
  id: string;
  name: string;
  releasedAt: string | null;
  medium: GetSourcesForSelect_sources_medium | null;
}

export interface GetSourcesForSelect {
  sources: GetSourcesForSelect_sources[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSourceStatements
// ====================================================

export interface GetSourceStatements_statements_sourceSpeaker_speaker {
  __typename: "Speaker";
  id: string;
  avatar: string | null;
}

export interface GetSourceStatements_statements_sourceSpeaker {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  role: string | null;
  speaker: GetSourceStatements_statements_sourceSpeaker_speaker;
}

export interface GetSourceStatements_statements_assessment_assessmentMethodology {
  __typename: "AssessmentMethodology";
  id: string;
  ratingModel: AssessmentMethodologyRatingModel;
  ratingKeys: string[];
}

export interface GetSourceStatements_statements_assessment_evaluator {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetSourceStatements_statements_assessment_veracity {
  __typename: "Veracity";
  id: string;
  key: GraphQLCustomScalar_VeracityKey;
  name: string;
}

export interface GetSourceStatements_statements_assessment_promiseRating {
  __typename: "PromiseRating";
  id: string;
  key: PromiseRatingKey;
  name: string;
}

export interface GetSourceStatements_statements_assessment {
  __typename: "Assessment";
  id: string;
  assessmentMethodology: GetSourceStatements_statements_assessment_assessmentMethodology;
  evaluationStatus: string;
  evaluator: GetSourceStatements_statements_assessment_evaluator | null;
  veracity: GetSourceStatements_statements_assessment_veracity | null;
  promiseRating: GetSourceStatements_statements_assessment_promiseRating | null;
  shortExplanation: string | null;
  shortExplanationCharactersLength: number;
  explanationCharactersLength: number;
}

export interface GetSourceStatements_statements_statementTranscriptPosition {
  __typename: "StatementTranscriptPosition";
  id: string;
  startLine: number;
  startOffset: number;
  endLine: number;
  endOffset: number;
}

export interface GetSourceStatements_statements_tags {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface GetSourceStatements_statements {
  __typename: "Statement";
  id: string;
  statementType: StatementType;
  content: string;
  title: string | null;
  important: boolean;
  published: boolean;
  sourceSpeaker: GetSourceStatements_statements_sourceSpeaker;
  assessment: GetSourceStatements_statements_assessment;
  statementTranscriptPosition: GetSourceStatements_statements_statementTranscriptPosition | null;
  tags: GetSourceStatements_statements_tags[];
  commentsCount: number;
  sourceOrder: number | null;
}

export interface GetSourceStatements {
  statements: GetSourceStatements_statements[];
}

export interface GetSourceStatementsVariables {
  sourceId: number;
  includeUnpublished?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_users_role {
  __typename: "Role";
  id: string;
  name: string;
}

export interface GetUsers_users {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  active: boolean;
  bio: string | null;
  positionDescription: string | null;
  emailNotifications: boolean;
  userPublic: boolean;
  rank: number | null;
  role: GetUsers_users_role;
}

export interface GetUsers {
  users: GetUsers_users[];
}

export interface GetUsersVariables {
  name?: string | null;
  includeInactive?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user_role {
  __typename: "Role";
  id: string;
  name: string;
}

export interface GetUser_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  active: boolean;
  bio: string | null;
  positionDescription: string | null;
  emailNotifications: boolean;
  userPublic: boolean;
  role: GetUser_user_role;
}

export interface GetUser {
  user: GetUser_user;
}

export interface GetUserVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBodies
// ====================================================

export interface GetBodies_bodies {
  __typename: "Body";
  id: string;
  logo: string | null;
  link: string | null;
  name: string;
  isParty: boolean;
  isInactive: boolean;
  shortName: string | null;
  foundedAt: string | null;
  terminatedAt: string | null;
}

export interface GetBodies {
  bodies: GetBodies_bodies[];
}

export interface GetBodiesVariables {
  name?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBody
// ====================================================

export interface GetBody_body {
  __typename: "Body";
  id: string;
  logo: string | null;
  link: string | null;
  name: string;
  isParty: boolean;
  isInactive: boolean;
  shortName: string | null;
  foundedAt: string | null;
  terminatedAt: string | null;
}

export interface GetBody {
  body: GetBody_body;
}

export interface GetBodyVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeakerBodies
// ====================================================

export interface GetSpeakerBodies_bodies {
  __typename: "Body";
  id: string;
  name: string;
  shortName: string | null;
  isInactive: boolean;
  terminatedAt: string | null;
}

export interface GetSpeakerBodies {
  bodies: GetSpeakerBodies_bodies[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeaker
// ====================================================

export interface GetSpeaker_speaker_memberships_body {
  __typename: "Body";
  id: string;
  shortName: string | null;
}

export interface GetSpeaker_speaker_memberships {
  __typename: "Membership";
  id: string;
  body: GetSpeaker_speaker_memberships_body;
  since: string | null;
  until: string | null;
}

export interface GetSpeaker_speaker {
  __typename: "Speaker";
  id: string;
  firstName: string;
  lastName: string;
  websiteUrl: string;
  avatar: string | null;
  /**
   * Temporary IDs from Hlidac statu, please use Wikidata ID instead
   */
  osobaId: string | null;
  wikidataId: string | null;
  role: string | null;
  memberships: GetSpeaker_speaker_memberships[] | null;
}

export interface GetSpeaker {
  speaker: GetSpeaker_speaker;
}

export interface GetSpeakerVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeakers
// ====================================================

export interface GetSpeakers_speakers_body {
  __typename: "Body";
  id: string;
  shortName: string | null;
}

export interface GetSpeakers_speakers_memberships_body {
  __typename: "Body";
  id: string;
  shortName: string | null;
}

export interface GetSpeakers_speakers_memberships {
  __typename: "Membership";
  id: string;
  body: GetSpeakers_speakers_memberships_body;
  since: string | null;
  until: string | null;
}

export interface GetSpeakers_speakers {
  __typename: "Speaker";
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  websiteUrl: string;
  /**
   * Temporary IDs from Hlidac statu, please use Wikidata ID instead
   */
  osobaId: string | null;
  wikidataId: string | null;
  role: string | null;
  body: GetSpeakers_speakers_body | null;
  memberships: GetSpeakers_speakers_memberships[] | null;
}

export interface GetSpeakers {
  speakers: GetSpeakers_speakers[];
}

export interface GetSpeakersVariables {
  limit?: number | null;
  offset?: number | null;
  name?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStatement
// ====================================================

export interface GetStatement_statement_sourceSpeaker_speaker {
  __typename: "Speaker";
  id: string;
  avatar: string | null;
}

export interface GetStatement_statement_sourceSpeaker {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  role: string | null;
  speaker: GetStatement_statement_sourceSpeaker_speaker;
}

export interface GetStatement_statement_assessment_assessmentMethodology {
  __typename: "AssessmentMethodology";
  id: string;
  ratingModel: AssessmentMethodologyRatingModel;
  ratingKeys: string[];
}

export interface GetStatement_statement_assessment_evaluator {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetStatement_statement_assessment_veracity {
  __typename: "Veracity";
  id: string;
  key: GraphQLCustomScalar_VeracityKey;
  name: string;
}

export interface GetStatement_statement_assessment_promiseRating {
  __typename: "PromiseRating";
  id: string;
  key: PromiseRatingKey;
  name: string;
}

export interface GetStatement_statement_assessment {
  __typename: "Assessment";
  id: string;
  assessmentMethodology: GetStatement_statement_assessment_assessmentMethodology;
  explanationHtml: string | null;
  explanationSlatejson: GraphQLCustomScalar_Json | null;
  shortExplanation: string | null;
  evaluationStatus: string;
  evaluator: GetStatement_statement_assessment_evaluator | null;
  veracity: GetStatement_statement_assessment_veracity | null;
  promiseRating: GetStatement_statement_assessment_promiseRating | null;
}

export interface GetStatement_statement_source_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface GetStatement_statement_source_mediaPersonalities {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface GetStatement_statement_source_experts {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetStatement_statement_source_sourceSpeakers_speaker {
  __typename: "Speaker";
  id: string;
}

export interface GetStatement_statement_source_sourceSpeakers {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  speaker: GetStatement_statement_source_sourceSpeakers_speaker;
}

export interface GetStatement_statement_source {
  __typename: "Source";
  id: string;
  name: string;
  sourceUrl: string | null;
  releasedAt: string | null;
  medium: GetStatement_statement_source_medium | null;
  mediaPersonalities: GetStatement_statement_source_mediaPersonalities[] | null;
  experts: GetStatement_statement_source_experts[] | null;
  sourceSpeakers: GetStatement_statement_source_sourceSpeakers[] | null;
}

export interface GetStatement_statement_statementTranscriptPosition {
  __typename: "StatementTranscriptPosition";
  id: string;
}

export interface GetStatement_statement_tags {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface GetStatement_statement_articleTags {
  __typename: "ArticleTag";
  id: string;
  title: string | null;
}

export interface GetStatement_statement {
  __typename: "Statement";
  id: string;
  statementType: StatementType;
  content: string;
  title: string | null;
  important: boolean;
  published: boolean;
  excerptedAt: string;
  sourceSpeaker: GetStatement_statement_sourceSpeaker;
  assessment: GetStatement_statement_assessment;
  source: GetStatement_statement_source;
  statementTranscriptPosition: GetStatement_statement_statementTranscriptPosition | null;
  tags: GetStatement_statement_tags[];
  articleTags: GetStatement_statement_articleTags[];
  commentsCount: number;
}

export interface GetStatement {
  statement: GetStatement_statement;
}

export interface GetStatementVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStatementComments
// ====================================================

export interface GetStatementComments_statement_comments_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetStatementComments_statement_comments {
  __typename: "Comment";
  id: string;
  content: string;
  user: GetStatementComments_statement_comments_user;
  createdAt: GraphQLCustomScalar_DateTime;
}

export interface GetStatementComments_statement {
  __typename: "Statement";
  id: string;
  commentsCount: number;
  comments: GetStatementComments_statement_comments[];
}

export interface GetStatementComments {
  statement: GetStatementComments_statement;
}

export interface GetStatementCommentsVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRoles
// ====================================================

export interface GetRoles_roles {
  __typename: "Role";
  id: string;
  key: string;
  name: string;
}

export interface GetRoles {
  roles: GetRoles_roles[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUser
// ====================================================

export interface GetCurrentUser_currentUser_role {
  __typename: "Role";
  id: string;
  key: string;
  name: string;
  permissions: string[];
}

export interface GetCurrentUser_currentUser {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: GetCurrentUser_currentUser_role;
}

export interface GetCurrentUser {
  currentUser: GetCurrentUser_currentUser;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetContentImages
// ====================================================

export interface GetContentImages_contentImages_items_user {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetContentImages_contentImages_items {
  __typename: "ContentImage";
  id: string;
  image: string;
  image50x50: string;
  name: string;
  createdAt: GraphQLCustomScalar_DateTime;
  user: GetContentImages_contentImages_items_user | null;
}

export interface GetContentImages_contentImages {
  __typename: "ContentImagesResult";
  totalCount: number;
  items: GetContentImages_contentImages_items[];
}

export interface GetContentImages {
  contentImages: GetContentImages_contentImages;
}

export interface GetContentImagesVariables {
  name?: string | null;
  offset?: number | null;
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNotifications
// ====================================================

export interface GetNotifications_notifications_items_statement_sourceSpeaker_speaker {
  __typename: "Speaker";
  id: string;
}

export interface GetNotifications_notifications_items_statement_sourceSpeaker {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  speaker: GetNotifications_notifications_items_statement_sourceSpeaker_speaker;
}

export interface GetNotifications_notifications_items_statement_source {
  __typename: "Source";
  id: string;
  name: string;
}

export interface GetNotifications_notifications_items_statement {
  __typename: "Statement";
  id: string;
  content: string;
  statementType: StatementType;
  sourceSpeaker: GetNotifications_notifications_items_statement_sourceSpeaker;
  source: GetNotifications_notifications_items_statement_source;
}

export interface GetNotifications_notifications_items {
  __typename: "Notification";
  id: string;
  fullText: string;
  statementText: string;
  statement: GetNotifications_notifications_items_statement;
  createdAt: GraphQLCustomScalar_DateTime;
  readAt: GraphQLCustomScalar_DateTime | null;
}

export interface GetNotifications_notifications {
  __typename: "NotificationsResult";
  totalCount: number;
  items: GetNotifications_notifications_items[];
}

export interface GetNotifications {
  notifications: GetNotifications_notifications;
}

export interface GetNotificationsVariables {
  includeRead?: boolean | null;
  offset?: number | null;
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPromiseRatingsForSelect
// ====================================================

export interface GetPromiseRatingsForSelect_promiseRatings {
  __typename: "PromiseRating";
  id: string;
  key: PromiseRatingKey;
  name: string;
}

export interface GetPromiseRatingsForSelect {
  promiseRatings: GetPromiseRatingsForSelect_promiseRatings[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTags
// ====================================================

export interface GetTags_tags {
  __typename: "Tag";
  id: string;
  name: string;
  forStatementType: StatementType;
  publishedStatementsCount: number;
  allStatementsCount: number;
}

export interface GetTags {
  tags: GetTags_tags[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticleTags
// ====================================================

export interface GetArticleTags_articleTags {
  __typename: "ArticleTag";
  id: string;
  title: string | null;
  slug: string;
  description: string | null;
  icon: string;
  stats: string | null;
  published: boolean | null;
  order: string;
  video: string | null;
}

export interface GetArticleTags {
  articleTags: GetArticleTags_articleTags[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticleTag
// ====================================================

export interface GetArticleTag_articleTag {
  __typename: "ArticleTag";
  id: string;
  title: string | null;
  slug: string;
  description: string | null;
  icon: string;
  stats: string | null;
  published: boolean | null;
  order: string;
  video: string | null;
}

export interface GetArticleTag {
  articleTag: GetArticleTag_articleTag;
}

export interface GetArticleTagVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticleTagsForSelect
// ====================================================

export interface GetArticleTagsForSelect_articleTags {
  __typename: "ArticleTag";
  id: string;
  title: string | null;
}

export interface GetArticleTagsForSelect {
  articleTags: GetArticleTagsForSelect_articleTags[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTagsForSelect
// ====================================================

export interface GetTagsForSelect_tags {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface GetTagsForSelect {
  tags: GetTagsForSelect_tags[];
}

export interface GetTagsForSelectVariables {
  forStatementType: StatementType;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetVeracitiesForSelect
// ====================================================

export interface GetVeracitiesForSelect_veracities {
  __typename: "Veracity";
  id: string;
  key: GraphQLCustomScalar_VeracityKey;
  name: string;
}

export interface GetVeracitiesForSelect {
  veracities: GetVeracitiesForSelect_veracities[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsersForSelect
// ====================================================

export interface GetUsersForSelect_users {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetUsersForSelect {
  users: GetUsersForSelect_users[];
}

export interface GetUsersForSelectVariables {
  roles?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeakersForSelect
// ====================================================

export interface GetSpeakersForSelect_speakers_body {
  __typename: "Body";
  id: string;
  shortName: string | null;
}

export interface GetSpeakersForSelect_speakers {
  __typename: "Speaker";
  id: string;
  firstName: string;
  lastName: string;
  body: GetSpeakersForSelect_speakers_body | null;
  role: string | null;
  avatar: string | null;
}

export interface GetSpeakersForSelect {
  speakers: GetSpeakersForSelect_speakers[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMediaPersonalitiesForSelect
// ====================================================

export interface GetMediaPersonalitiesForSelect_mediaPersonalities {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface GetMediaPersonalitiesForSelect {
  mediaPersonalities: GetMediaPersonalitiesForSelect_mediaPersonalities[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSourceWithStatementsAndVideoMarks
// ====================================================

export interface GetSourceWithStatementsAndVideoMarks_source_statements_sourceSpeaker_speaker {
  __typename: "Speaker";
  id: string;
}

export interface GetSourceWithStatementsAndVideoMarks_source_statements_sourceSpeaker {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  speaker: GetSourceWithStatementsAndVideoMarks_source_statements_sourceSpeaker_speaker;
}

export interface GetSourceWithStatementsAndVideoMarks_source_statements_statementVideoMark {
  __typename: "StatementVideoMark";
  id: string;
  start: number;
  stop: number;
}

export interface GetSourceWithStatementsAndVideoMarks_source_statements {
  __typename: "Statement";
  id: string;
  content: string;
  sourceSpeaker: GetSourceWithStatementsAndVideoMarks_source_statements_sourceSpeaker;
  statementVideoMark: GetSourceWithStatementsAndVideoMarks_source_statements_statementVideoMark | null;
}

export interface GetSourceWithStatementsAndVideoMarks_source {
  __typename: "Source";
  id: string;
  name: string;
  sourceUrl: string | null;
  releasedAt: string | null;
  transcript: string | null;
  videoType: string | null;
  videoId: string | null;
  statements: GetSourceWithStatementsAndVideoMarks_source_statements[];
}

export interface GetSourceWithStatementsAndVideoMarks {
  source: GetSourceWithStatementsAndVideoMarks_source;
}

export interface GetSourceWithStatementsAndVideoMarksVariables {
  id: number;
  includeUnpublished?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetInternalOverallStats
// ====================================================

export interface GetInternalOverallStats_internalOverallStats {
  __typename: "InternalOverallStats";
  factualAndPublishedStatementsCount: number;
  speakersWithFactualAndPublishedStatementsCount: number;
}

export interface GetInternalOverallStats {
  internalOverallStats: GetInternalOverallStats_internalOverallStats;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetWebContents
// ====================================================

export interface GetWebContents_webContents {
  __typename: "WebContent";
  id: string;
  systemId: string;
  name: string;
  urlPath: string;
  dynamicPage: boolean;
  dynamicPagePublished: boolean;
  structure: GraphQLCustomScalar_JSON;
  data: GraphQLCustomScalar_JSON;
}

export interface GetWebContents {
  webContents: GetWebContents_webContents[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetWebContent
// ====================================================

export interface GetWebContent_webContent {
  __typename: "WebContent";
  id: string;
  systemId: string;
  name: string;
  urlPath: string;
  dynamicPage: boolean;
  dynamicPagePublished: boolean;
  structure: GraphQLCustomScalar_JSON;
  data: GraphQLCustomScalar_JSON;
}

export interface GetWebContent {
  webContent: GetWebContent_webContent;
}

export interface GetWebContentVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserStatements
// ====================================================

export interface GetUserStatements_statements_source_medium {
  __typename: "Medium";
  id: string;
  name: string;
}

export interface GetUserStatements_statements_source_mediaPersonalities {
  __typename: "MediaPersonality";
  id: string;
  name: string;
}

export interface GetUserStatements_statements_source_experts {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetUserStatements_statements_source_sourceSpeakers_speaker {
  __typename: "Speaker";
  id: string;
}

export interface GetUserStatements_statements_source_sourceSpeakers {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  speaker: GetUserStatements_statements_source_sourceSpeakers_speaker;
}

export interface GetUserStatements_statements_source {
  __typename: "Source";
  id: string;
  name: string;
  sourceUrl: string | null;
  releasedAt: string | null;
  medium: GetUserStatements_statements_source_medium | null;
  mediaPersonalities: GetUserStatements_statements_source_mediaPersonalities[] | null;
  experts: GetUserStatements_statements_source_experts[] | null;
  sourceSpeakers: GetUserStatements_statements_source_sourceSpeakers[] | null;
}

export interface GetUserStatements_statements_sourceSpeaker_speaker {
  __typename: "Speaker";
  id: string;
  avatar: string | null;
}

export interface GetUserStatements_statements_sourceSpeaker {
  __typename: "SourceSpeaker";
  id: string;
  firstName: string;
  lastName: string;
  role: string | null;
  speaker: GetUserStatements_statements_sourceSpeaker_speaker;
}

export interface GetUserStatements_statements_assessment_evaluator {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetUserStatements_statements_assessment_veracity {
  __typename: "Veracity";
  id: string;
  key: GraphQLCustomScalar_VeracityKey;
  name: string;
}

export interface GetUserStatements_statements_assessment_promiseRating {
  __typename: "PromiseRating";
  id: string;
  key: PromiseRatingKey;
  name: string;
}

export interface GetUserStatements_statements_assessment {
  __typename: "Assessment";
  id: string;
  evaluationStatus: string;
  evaluator: GetUserStatements_statements_assessment_evaluator | null;
  veracity: GetUserStatements_statements_assessment_veracity | null;
  promiseRating: GetUserStatements_statements_assessment_promiseRating | null;
  shortExplanation: string | null;
  shortExplanationCharactersLength: number;
  explanationCharactersLength: number;
}

export interface GetUserStatements_statements_tags {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface GetUserStatements_statements {
  __typename: "Statement";
  id: string;
  statementType: StatementType;
  content: string;
  title: string | null;
  important: boolean;
  published: boolean;
  source: GetUserStatements_statements_source;
  sourceSpeaker: GetUserStatements_statements_sourceSpeaker;
  assessment: GetUserStatements_statements_assessment;
  tags: GetUserStatements_statements_tags[];
  commentsCount: number;
  sourceOrder: number | null;
}

export interface GetUserStatements {
  statements: GetUserStatements_statements[];
}

export interface GetUserStatementsVariables {
  limit?: number | null;
  offset?: number | null;
  includeUnpublished?: boolean | null;
  evaluatedByUserId?: string | null;
  sortSourcesInReverseChronologicalOrder?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PublishEfcsnArticle
// ====================================================

export interface PublishEfcsnArticle {
  __typename: "Article";
  id: string;
  efcsnExternalId: string | null;
  efcsnCreatedAt: GraphQLCustomScalar_DateTime | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AssessmentMethodologyRatingModel {
  promise_rating = "promise_rating",
  veracity = "veracity",
}

export enum PromiseRatingKey {
  broken = "broken",
  fulfilled = "fulfilled",
  in_progress = "in_progress",
  not_yet_evaluated = "not_yet_evaluated",
  partially_fulfilled = "partially_fulfilled",
  stalled = "stalled",
}

export enum StatementType {
  factual = "factual",
  newyears = "newyears",
  promise = "promise",
}

export interface ArticleInput {
  articleType: string;
  title: string;
  titleEn?: string | null;
  perex?: string | null;
  segments: ArticleSegmentInput[];
  slug?: string | null;
  published?: boolean | null;
  publishedAt?: string | null;
  sourceId?: string | null;
  articleTags?: string[] | null;
  assessmentMethodologyId?: string | null;
}

export interface ArticleSegmentInput {
  id?: string | null;
  segmentType: string;
  textHtml?: string | null;
  textSlatejson?: GraphQLCustomScalar_Json | null;
  sourceId?: string | null;
  promiseUrl?: string | null;
  statementId?: string | null;
}

export interface ArticleTagInput {
  title: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  published?: boolean | null;
  stats?: string | null;
  video?: string | null;
  order?: string | null;
}

export interface BodyInput {
  name: string;
  isParty: boolean;
  isInactive: boolean;
  shortName?: string | null;
  link?: string | null;
  foundedAt?: string | null;
  terminatedAt?: string | null;
}

export interface CommentInput {
  content: string;
  statementId: string;
}

export interface CreateAssessmentInput {
  evaluatorId?: string | null;
  shortExplanation?: string | null;
  veracityId?: string | null;
}

export interface CreateStatementInput {
  statementType: StatementType;
  content: string;
  excerptedAt: string;
  important: boolean;
  sourceSpeakerId: string;
  sourceId: string;
  published: boolean;
  assessment: CreateAssessmentInput;
  statementTranscriptPosition?: StatementTranscriptPositionInput | null;
  statementVideoMark?: StatementVideoMarkInput | null;
  firstCommentContent?: string | null;
}

export interface MediaPersonalityInput {
  name: string;
}

export interface MediumInput {
  name: string;
}

export interface MembershipInput {
  id?: string | null;
  since?: string | null;
  until?: string | null;
  bodyId: string;
}

export interface PageInput {
  title: string;
  textHtml?: string | null;
  textSlatejson?: GraphQLCustomScalar_Json | null;
  published?: boolean | null;
  slug?: string | null;
}

export interface SourceInput {
  name: string;
  releasedAt?: string | null;
  sourceUrl?: string | null;
  mediumId?: string | null;
  mediaPersonalities?: string[] | null;
  transcript?: string | null;
  sourceSpeakers?: SourceSpeakerInput[] | null;
  experts?: string[] | null;
}

export interface SourceInputVideoFields {
  videoType: string;
  videoId: string;
}

export interface SourceSpeakerInput {
  id?: string | null;
  speakerId: string;
  firstName: string;
  lastName: string;
  role?: string | null;
  bodyId?: string | null;
}

export interface SpeakerInput {
  firstName: string;
  lastName: string;
  websiteUrl?: string | null;
  memberships: MembershipInput[];
  osobaId?: string | null;
  wikidataId?: string | null;
  role?: string | null;
}

export interface StatementTranscriptPositionInput {
  startLine: number;
  startOffset: number;
  endLine: number;
  endOffset: number;
}

export interface StatementVideoMarkInput {
  start: number;
  stop: number;
}

export interface StatementsVideoMarksInput {
  statementId: string;
  start: number;
  stop: number;
}

export interface TagInput {
  name: string;
  forStatementType: StatementType;
}

export interface UpdateAssessmentInput {
  evaluatorId?: string | null;
  evaluationStatus?: string | null;
  explanationHtml?: string | null;
  explanationSlatejson?: GraphQLCustomScalar_Json | null;
  shortExplanation?: string | null;
  veracityId?: string | null;
  promiseRatingId?: string | null;
}

export interface UpdateNotificationInput {
  readAt?: string | null;
}

export interface UpdateSourceStatementsOrderInput {
  orderedStatementIds: string[];
}

export interface UpdateStatementInput {
  content?: string | null;
  title?: string | null;
  important?: boolean | null;
  published?: boolean | null;
  assessment?: UpdateAssessmentInput | null;
  tags?: string[] | null;
  sourceSpeakerId?: string | null;
  articleTags?: string[] | null;
}

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  emailNotifications: boolean;
  positionDescription?: string | null;
  bio?: string | null;
  phone?: string | null;
  order?: number | null;
  rank?: number | null;
  userPublic?: boolean | null;
}

export interface WebContentInput {
  name?: string | null;
  urlPath?: string | null;
  dynamicPage?: boolean | null;
  dynamicPagePublished?: boolean | null;
  data?: GraphQLCustomScalar_JSON | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
