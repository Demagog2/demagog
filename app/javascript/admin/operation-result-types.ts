

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateArticle
// ====================================================

export interface CreateArticle_createArticle {
  id: string;
  title: string;
}

export interface CreateArticle {
  createArticle: CreateArticle_createArticle | null;  // Add new article
}

export interface CreateArticleVariables {
  articleInput: ArticleInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateArticle
// ====================================================

export interface UpdateArticle_updateArticle {
  id: string;
  title: string;
}

export interface UpdateArticle {
  updateArticle: UpdateArticle_updateArticle | null;  // Update existing article
}

export interface UpdateArticleVariables {
  id: string;
  articleInput: ArticleInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteArticle
// ====================================================

export interface DeleteArticle {
  deleteArticle: string;  // Delete existing article
}

export interface DeleteArticleVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSource
// ====================================================

export interface CreateSource_createSource {
  id: string;
  name: string;
}

export interface CreateSource {
  createSource: CreateSource_createSource | null;  // Add new source
}

export interface CreateSourceVariables {
  sourceInput: SourceInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSource
// ====================================================

export interface UpdateSource_updateSource {
  id: string;
  name: string;
}

export interface UpdateSource {
  updateSource: UpdateSource_updateSource | null;  // Update existing source
}

export interface UpdateSourceVariables {
  id: number;
  sourceInput: SourceInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSource
// ====================================================

export interface DeleteSource {
  deleteSource: string;  // Delete existing source with all its statements
}

export interface DeleteSourceVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateBody
// ====================================================

export interface CreateBody_createBody {
  id: string;
  logo: string | null;
  name: string;
  is_party: boolean;
  is_inactive: boolean;
  short_name: string | null;
  link: string | null;
  founded_at: string | null;
  terminated_at: string | null;
}

export interface CreateBody {
  createBody: CreateBody_createBody | null;  // Add new body
}

export interface CreateBodyVariables {
  bodyInput: BodyInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateBody
// ====================================================

export interface UpdateBody_updateBody {
  id: string;
  logo: string | null;
  name: string;
  is_party: boolean;
  is_inactive: boolean;
  short_name: string | null;
  link: string | null;
  founded_at: string | null;
  terminated_at: string | null;
}

export interface UpdateBody {
  updateBody: UpdateBody_updateBody | null;  // Update existing body
}

export interface UpdateBodyVariables {
  id: number;
  bodyInput: BodyInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteBody
// ====================================================

export interface DeleteBody {
  deleteBody: string;  // Delete existing body
}

export interface DeleteBodyVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSpeaker
// ====================================================

export interface CreateSpeaker_createSpeaker_body {
  short_name: string | null;
}

export interface CreateSpeaker_createSpeaker_memberships_body {
  id: string;
  short_name: string | null;
}

export interface CreateSpeaker_createSpeaker_memberships {
  id: string;
  body: CreateSpeaker_createSpeaker_memberships_body;
  since: string | null;
  until: string | null;
}

export interface CreateSpeaker_createSpeaker {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  website_url: string;
  body: CreateSpeaker_createSpeaker_body | null;
  memberships: CreateSpeaker_createSpeaker_memberships[];
}

export interface CreateSpeaker {
  createSpeaker: CreateSpeaker_createSpeaker | null;  // Add new speaker
}

export interface CreateSpeakerVariables {
  speakerInput: SpeakerInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSpeaker
// ====================================================

export interface UpdateSpeaker_updateSpeaker_body {
  short_name: string | null;
}

export interface UpdateSpeaker_updateSpeaker_memberships_body {
  id: string;
  short_name: string | null;
}

export interface UpdateSpeaker_updateSpeaker_memberships {
  id: string;
  body: UpdateSpeaker_updateSpeaker_memberships_body;
  since: string | null;
  until: string | null;
}

export interface UpdateSpeaker_updateSpeaker {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  website_url: string;
  body: UpdateSpeaker_updateSpeaker_body | null;
  memberships: UpdateSpeaker_updateSpeaker_memberships[];
}

export interface UpdateSpeaker {
  updateSpeaker: UpdateSpeaker_updateSpeaker | null;  // Update existing speaker
}

export interface UpdateSpeakerVariables {
  id: number;
  speakerInput: SpeakerInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSpeaker
// ====================================================

export interface DeleteSpeaker {
  deleteSpeaker: string;  // Delete existing speaker
}

export interface DeleteSpeakerVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUser
// ====================================================

export interface CreateUser_createUser_role {
  id: string;
  name: string;
}

export interface CreateUser_createUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  active: boolean;
  position_description: string | null;
  bio: string | null;
  role: CreateUser_createUser_role;
}

export interface CreateUser {
  createUser: CreateUser_createUser | null;  // Add new user
}

export interface CreateUserVariables {
  userInput: UserInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser_role {
  id: string;
  name: string;
}

export interface UpdateUser_updateUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  active: boolean;
  position_description: string | null;
  bio: string | null;
  role: UpdateUser_updateUser_role;
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser | null;  // Update existing user
}

export interface UpdateUserVariables {
  id: number;
  userInput: UserInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteUser
// ====================================================

export interface DeleteUser {
  deleteUser: string;  // Delete existing user
}

export interface DeleteUserVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateStatement
// ====================================================

export interface CreateStatement_createStatement_speaker {
  id: string;
}

export interface CreateStatement_createStatement {
  id: string;
  content: string;
  excerpted_at: string;
  important: boolean;
  speaker: CreateStatement_createStatement_speaker;
}

export interface CreateStatement {
  createStatement: CreateStatement_createStatement | null;  // Add new statement
}

export interface CreateStatementVariables {
  statementInput: CreateStatementInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateStatement
// ====================================================

export interface UpdateStatement_updateStatement_speaker {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface UpdateStatement_updateStatement_assessment_evaluator {
  id: string;
  first_name: string;
  last_name: string;
}

export interface UpdateStatement_updateStatement_assessment_veracity {
  id: string;
  key: GraphQLCustomScalar_VeracityKey;
  name: string;
}

export interface UpdateStatement_updateStatement_assessment {
  id: string;
  short_explanation: string | null;
  explanation_html: string | null;
  explanation_slatejson: GraphQLCustomScalar_JSON | null;
  evaluation_status: string;
  evaluator: UpdateStatement_updateStatement_assessment_evaluator | null;
  veracity: UpdateStatement_updateStatement_assessment_veracity | null;
}

export interface UpdateStatement_updateStatement {
  id: string;
  content: string;
  important: boolean;
  published: boolean;
  excerpted_at: string;
  speaker: UpdateStatement_updateStatement_speaker;
  assessment: UpdateStatement_updateStatement_assessment;
  comments_count: number;
}

export interface UpdateStatement {
  updateStatement: UpdateStatement_updateStatement | null;  // Update existing statement
}

export interface UpdateStatementVariables {
  id: number;
  statementInput: UpdateStatementInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteStatement
// ====================================================

export interface DeleteStatement {
  deleteStatement: string;  // Delete existing statement
}

export interface DeleteStatementVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateComment
// ====================================================

export interface CreateComment_createComment_user {
  id: string;
  first_name: string;
  last_name: string;
}

export interface CreateComment_createComment {
  id: string;
  content: string;
  user: CreateComment_createComment_user;
  created_at: GraphQLCustomScalar_DateTime;
}

export interface CreateComment {
  createComment: CreateComment_createComment | null;  // Add new comment
}

export interface CreateCommentVariables {
  commentInput: CommentInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSourceStatementsOrder
// ====================================================

export interface UpdateSourceStatementsOrder_updateSourceStatementsOrder {
  id: string;
}

export interface UpdateSourceStatementsOrder {
  updateSourceStatementsOrder: UpdateSourceStatementsOrder_updateSourceStatementsOrder | null;  // Update order of statements in source
}

export interface UpdateSourceStatementsOrderVariables {
  id: string;
  input: UpdateSourceStatementsOrderInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateContentImage
// ====================================================

export interface CreateContentImage_createContentImage_user {
  id: string;
  first_name: string;
  last_name: string;
}

export interface CreateContentImage_createContentImage {
  id: string;
  created_at: GraphQLCustomScalar_DateTime;
  user: CreateContentImage_createContentImage_user | null;
}

export interface CreateContentImage {
  createContentImage: CreateContentImage_createContentImage | null;  // Add new content image
}

export interface CreateContentImageVariables {
  input: ContentImageInputType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteContentImage
// ====================================================

export interface DeleteContentImage {
  deleteContentImage: string;  // Delete existing content image
}

export interface DeleteContentImageVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticle
// ====================================================

export interface GetArticle_article_segments_statements {
  id: string;
}

export interface GetArticle_article_segments {
  id: string;
  segment_type: string;
  text_html: string | null;
  text_slatejson: GraphQLCustomScalar_JSON | null;
  statements: GetArticle_article_segments_statements[];
}

export interface GetArticle_article {
  title: string;
  slug: string;
  perex: string | null;
  published: boolean;
  published_at: GraphQLCustomScalar_DateTime | null;
  illustration: string | null;
  segments: GetArticle_article_segments[] | null;
}

export interface GetArticle {
  article: GetArticle_article;
}

export interface GetArticleVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticles
// ====================================================

export interface GetArticles_articles {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  published_at: GraphQLCustomScalar_DateTime | null;
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
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMediaPersonalities
// ====================================================

export interface GetMediaPersonalities_media_personalities {
  id: string;
  name: string;
}

export interface GetMediaPersonalities {
  media_personalities: GetMediaPersonalities_media_personalities[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMedia
// ====================================================

export interface GetMedia_media {
  id: string;
  name: string;
}

export interface GetMedia {
  media: GetMedia_media[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSources
// ====================================================

export interface GetSources_sources_medium {
  id: string;
  name: string;
}

export interface GetSources_sources_media_personality {
  id: string;
  name: string;
}

export interface GetSources_sources_statements_counts_by_evaluation_status {
  evaluation_status: string;
  statements_count: number;
}

export interface GetSources_sources_statements {
  id: string;
}

export interface GetSources_sources {
  id: string;
  name: string;
  source_url: string | null;
  released_at: string;
  medium: GetSources_sources_medium;
  media_personality: GetSources_sources_media_personality;
  statements_counts_by_evaluation_status: GetSources_sources_statements_counts_by_evaluation_status[];
  statements: GetSources_sources_statements[];
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
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSource
// ====================================================

export interface GetSource_source_medium {
  id: string;
  name: string;
}

export interface GetSource_source_media_personality {
  id: string;
  name: string;
}

export interface GetSource_source_speakers {
  id: string;
  first_name: string;
  last_name: string;
}

export interface GetSource_source {
  id: string;
  name: string;
  source_url: string | null;
  released_at: string;
  transcript: string | null;
  medium: GetSource_source_medium;
  media_personality: GetSource_source_media_personality;
  speakers: GetSource_source_speakers[];
}

export interface GetSource {
  source: GetSource_source;
}

export interface GetSourceVariables {
  id: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSourceStatements
// ====================================================

export interface GetSourceStatements_statements_speaker {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface GetSourceStatements_statements_assessment_evaluator {
  id: string;
  first_name: string;
  last_name: string;
}

export interface GetSourceStatements_statements_assessment {
  id: string;
  evaluation_status: string;
  evaluator: GetSourceStatements_statements_assessment_evaluator | null;
}

export interface GetSourceStatements_statements_statement_transcript_position {
  id: string;
  start_line: number;
  start_offset: number;
  end_line: number;
  end_offset: number;
}

export interface GetSourceStatements_statements {
  id: string;
  content: string;
  important: boolean;
  published: boolean;
  speaker: GetSourceStatements_statements_speaker;
  assessment: GetSourceStatements_statements_assessment;
  statement_transcript_position: GetSourceStatements_statements_statement_transcript_position | null;
  comments_count: number;
  source_order: number | null;
}

export interface GetSourceStatements {
  statements: GetSourceStatements_statements[];
}

export interface GetSourceStatementsVariables {
  sourceId: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_users_role {
  id: string;
  name: string;
}

export interface GetUsers_users {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  active: boolean;
  bio: string | null;
  position_description: string | null;
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
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user_role {
  id: string;
  name: string;
}

export interface GetUser_user {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  active: boolean;
  bio: string | null;
  position_description: string | null;
  role: GetUser_user_role;
}

export interface GetUser {
  user: GetUser_user;
}

export interface GetUserVariables {
  id: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBodies
// ====================================================

export interface GetBodies_bodies {
  id: string;
  logo: string | null;
  link: string | null;
  name: string;
  is_party: boolean;
  is_inactive: boolean;
  short_name: string | null;
  founded_at: string | null;
  terminated_at: string | null;
}

export interface GetBodies {
  bodies: GetBodies_bodies[];
}

export interface GetBodiesVariables {
  name?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBody
// ====================================================

export interface GetBody_body {
  id: string;
  logo: string | null;
  link: string | null;
  name: string;
  is_party: boolean;
  is_inactive: boolean;
  short_name: string | null;
  founded_at: string | null;
  terminated_at: string | null;
}

export interface GetBody {
  body: GetBody_body;
}

export interface GetBodyVariables {
  id: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeakerBodies
// ====================================================

export interface GetSpeakerBodies_bodies {
  id: string;
  name: string;
  short_name: string | null;
  is_inactive: boolean;
  terminated_at: string | null;
}

export interface GetSpeakerBodies {
  bodies: GetSpeakerBodies_bodies[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeaker
// ====================================================

export interface GetSpeaker_speaker_memberships_body {
  id: string;
  short_name: string | null;
}

export interface GetSpeaker_speaker_memberships {
  id: string;
  body: GetSpeaker_speaker_memberships_body;
  since: string | null;
  until: string | null;
}

export interface GetSpeaker_speaker {
  id: string;
  first_name: string;
  last_name: string;
  website_url: string;
  avatar: string | null;
  memberships: GetSpeaker_speaker_memberships[];
}

export interface GetSpeaker {
  speaker: GetSpeaker_speaker;
}

export interface GetSpeakerVariables {
  id: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeakers
// ====================================================

export interface GetSpeakers_speakers_body {
  short_name: string | null;
}

export interface GetSpeakers_speakers_memberships_body {
  id: string;
  short_name: string | null;
}

export interface GetSpeakers_speakers_memberships {
  id: string;
  body: GetSpeakers_speakers_memberships_body;
  since: string | null;
  until: string | null;
}

export interface GetSpeakers_speakers {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  website_url: string;
  body: GetSpeakers_speakers_body | null;
  memberships: GetSpeakers_speakers_memberships[];
}

export interface GetSpeakers {
  speakers: GetSpeakers_speakers[];
}

export interface GetSpeakersVariables {
  name?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStatement
// ====================================================

export interface GetStatement_statement_speaker {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface GetStatement_statement_assessment_evaluator {
  id: string;
  first_name: string;
  last_name: string;
}

export interface GetStatement_statement_assessment_veracity {
  id: string;
  key: GraphQLCustomScalar_VeracityKey;
  name: string;
}

export interface GetStatement_statement_assessment {
  id: string;
  explanation_html: string | null;
  explanation_slatejson: GraphQLCustomScalar_JSON | null;
  short_explanation: string | null;
  evaluation_status: string;
  evaluator: GetStatement_statement_assessment_evaluator | null;
  veracity: GetStatement_statement_assessment_veracity | null;
}

export interface GetStatement_statement_source_medium {
  id: string;
  name: string;
}

export interface GetStatement_statement_source_media_personality {
  id: string;
  name: string;
}

export interface GetStatement_statement_source {
  id: string;
  name: string;
  source_url: string | null;
  released_at: string;
  medium: GetStatement_statement_source_medium;
  media_personality: GetStatement_statement_source_media_personality;
}

export interface GetStatement_statement {
  id: string;
  content: string;
  important: boolean;
  published: boolean;
  excerpted_at: string;
  speaker: GetStatement_statement_speaker;
  assessment: GetStatement_statement_assessment;
  source: GetStatement_statement_source;
  comments_count: number;
}

export interface GetStatement {
  statement: GetStatement_statement;
}

export interface GetStatementVariables {
  id: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStatementComments
// ====================================================

export interface GetStatementComments_statement_comments_user {
  id: string;
  first_name: string;
  last_name: string;
}

export interface GetStatementComments_statement_comments {
  id: string;
  content: string;
  user: GetStatementComments_statement_comments_user;
  created_at: GraphQLCustomScalar_DateTime;
}

export interface GetStatementComments_statement {
  id: string;
  comments_count: number;
  comments: GetStatementComments_statement_comments[];
}

export interface GetStatementComments {
  statement: GetStatementComments_statement;
}

export interface GetStatementCommentsVariables {
  id: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRoles
// ====================================================

export interface GetRoles_roles {
  id: string;
  key: string;
  name: string;
}

export interface GetRoles {
  roles: GetRoles_roles[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUser
// ====================================================

export interface GetCurrentUser_current_user_role {
  id: string;
  key: string;
  name: string;
  permissions: string[];
}

export interface GetCurrentUser_current_user {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: GetCurrentUser_current_user_role;
}

export interface GetCurrentUser {
  current_user: GetCurrentUser_current_user;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetContentImages
// ====================================================

export interface GetContentImages_content_images_items_user {
  id: string;
  first_name: string;
  last_name: string;
}

export interface GetContentImages_content_images_items {
  id: string;
  image: string;
  image_50x50: string;
  name: string;
  created_at: GraphQLCustomScalar_DateTime;
  user: GetContentImages_content_images_items_user | null;
}

export interface GetContentImages_content_images {
  total_count: number;
  items: GetContentImages_content_images_items[];
}

export interface GetContentImages {
  content_images: GetContentImages_content_images;
}

export interface GetContentImagesVariables {
  name?: string | null;
  offset?: number | null;
  limit?: number | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

// null
export interface ArticleInputType {
  title: string;
  perex: string;
  slug?: string | null;
  published?: boolean | null;
  published_at?: string | null;
  segments?: SegmentInputType[] | null;
}

// null
export interface SegmentInputType {
  id?: string | null;
  segment_type: string;
  text_html?: string | null;
  text_slatejson?: GraphQLCustomScalar_JSON | null;
  statements?: string[] | null;
}

// null
export interface SourceInputType {
  name: string;
  released_at: string;
  source_url?: string | null;
  medium_id?: string | null;
  media_personality_id?: string | null;
  transcript: string;
  speakers: string[];
}

// null
export interface BodyInputType {
  name: string;
  is_party: boolean;
  is_inactive: boolean;
  short_name?: string | null;
  link?: string | null;
  founded_at?: string | null;
  terminated_at?: string | null;
}

// null
export interface SpeakerInputType {
  first_name: string;
  last_name: string;
  website_url?: string | null;
  memberships: MembershipInputType[];
}

// null
export interface MembershipInputType {
  id?: string | null;
  since?: string | null;
  until?: string | null;
  body_id: string;
}

// null
export interface UserInputType {
  email: string;
  active: boolean;
  first_name: string;
  last_name: string;
  role_id: string;
  position_description?: string | null;
  bio?: string | null;
  phone?: string | null;
  order?: number | null;
  rank?: number | null;
}

// null
export interface CreateStatementInputType {
  content: string;
  excerpted_at: string;
  important: boolean;
  speaker_id: string;
  source_id: string;
  published: boolean;
  count_in_statistics: boolean;
  assessment: CreateAssessmentInputType;
  statement_transcript_position?: StatementTranscriptPositionInputType | null;
  first_comment_content?: string | null;
}

// null
export interface CreateAssessmentInputType {
  evaluator_id?: string | null;
  explanation?: string | null;
  veracity_id?: string | null;
}

// null
export interface StatementTranscriptPositionInputType {
  start_line: number;
  start_offset: number;
  end_line: number;
  end_offset: number;
}

// null
export interface UpdateStatementInputType {
  content?: string | null;
  important?: boolean | null;
  published?: boolean | null;
  count_in_statistics?: boolean | null;
  assessment?: UpdateAssessmentInputType | null;
}

// null
export interface UpdateAssessmentInputType {
  evaluator_id?: string | null;
  evaluation_status?: string | null;
  explanation_html?: string | null;
  explanation_slatejson?: GraphQLCustomScalar_JSON | null;
  short_explanation?: string | null;
  veracity_id?: string | null;
}

// null
export interface CommentInputType {
  content: string;
  statement_id: string;
}

// null
export interface UpdateSourceStatementsOrderInputType {
  ordered_statement_ids?: string[] | null;
}

// null
export interface ContentImageInputType {
  user_id: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================