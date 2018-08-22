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

// Custom slate-html-serializer types before there are any better on the web
declare module 'slate-html-serializer' {
  import * as React from 'react';
  import { BlockProperties, Value, ValueProperties } from 'slate';

  // tslint:disable-next-line:interface-name
  export interface Rule {
    deserialize?: (
      el: Element,
      next: (elements: Element[] | NodeList | Array<Node & ChildNode>) => any,
    ) => any;
    serialize?: (obj: any, children: string) => React.ReactNode;
  }

  // tslint:disable-next-line:interface-name
  export interface HtmlOptions {
    rules?: Rule[];
    defaultBlock?: BlockProperties;
    parseHtml?: (html: string) => HTMLElement;
  }

  export default class Html {
    constructor(options?: HtmlOptions);

    public deserialize(html: string, options: { toJSON: true }): ValueProperties;
    public deserialize(html: string, options?: { toJSON?: false }): Value;

    public serialize(value: Value, options?: { render?: true }): string;
    public serialize(value: Value, options: { render: false }): Element[];
  }
}
