// Provided by webpack's DefinePlugin
declare let CHANGELOG_LAST_UPDATE_DATE: string;

// Allow loading non-code modules in React code
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.pdf';
declare module '*.svg';

// GraphQL custom scalar types
type GraphQLCustomScalar_VeracityKey = 'true' | 'untrue' | 'misleading' | 'unverifiable';
type GraphQLCustomScalar_DateTime = string;
type GraphQLCustomScalar_Json = object;
type GraphQLCustomScalar_JSON = Record<string, any>;

// Add custom elements
declare namespace JSX {
  interface IntrinsicElements {
    'demagogcz-widget': any;
  }
}
