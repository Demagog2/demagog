// Provided by webpack's DefinePlugin
declare var CHANGELOG_LAST_UPDATE_DATE: string;

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
// tslint:disable-next-line:interface-over-type-literal
type GraphQLCustomScalar_JSON = { [key: string]: any };

// Add custom elements
// tslint:disable-next-line:no-namespace
declare namespace JSX {
  // tslint:disable-next-line:interface-name
  interface IntrinsicElements {
    'demagogcz-widget': any;
  }
}
