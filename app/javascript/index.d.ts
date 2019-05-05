// Provided by webpack's DefinePlugin
declare var CHANGELOG_LAST_UPDATE_DATE: string;

// Allow loading non-code modules in React code
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.pdf';

// GraphQL custom scalar types
type GraphQLCustomScalar_StatementType = 'factual' | 'promise';
type GraphQLCustomScalar_PromiseRatingKey =
  | 'fulfilled'
  | 'partially_fulfilled'
  | 'broken'
  | 'stalled';
type GraphQLCustomScalar_VeracityKey = 'true' | 'untrue' | 'misleading' | 'unverifiable';
type GraphQLCustomScalar_DateTime = string;
type GraphQLCustomScalar_JSON = object;
