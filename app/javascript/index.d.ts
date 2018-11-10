// Provided by webpack's DefinePlugin
declare var CHANGELOG_LAST_UPDATE_DATE: string;

// Allow loading image modules in React code
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';

// GraphQL custom scalar types
type GraphQLCustomScalar_VeracityKey = 'true' | 'untrue' | 'misleading' | 'unverifiable';
type GraphQLCustomScalar_DateTime = string;
type GraphQLCustomScalar_JSON = object;
