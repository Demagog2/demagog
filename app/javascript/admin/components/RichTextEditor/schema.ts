import * as Raven from 'raven-js';
import * as Slate from 'slate';
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations';

export default {
  document: {
    // nodes: [{ types: ['paragraph', 'unordered-list', 'ordered-list', 'image', 'embed', 'header'] }],
    nodes: [
      {
        match: [
          { object: 'block', type: 'paragraph' },
          { object: 'block', type: 'unordered-list' },
          { object: 'block', type: 'ordered-list' },
          { object: 'block', type: 'image' },
          { object: 'block', type: 'embed' },
          { object: 'block', type: 'header' },
        ],
      },
    ],

    // We want to make sure there is a line after embed or image, because users
    // cannot create new line themselves
    last: { type: 'paragraph' },

    normalize: (editor: Slate.Editor, error: Slate.SlateError) => {
      switch (error.code) {
        case LAST_CHILD_TYPE_INVALID: {
          const paragraph = Slate.Block.fromJSON({
            object: 'block',
            type: 'paragraph',
            nodes: [{ object: 'text', leaves: [{ text: '' }] }],
          });
          return editor.insertNodeByKey(error.node.key, error.node.nodes.size, paragraph);
        }
      }

      captureAsRavenWarning(error);
    },
  },
  blocks: {
    // tslint:disable-next-line:object-literal-key-quotes
    paragraph: {
      nodes: [{ match: [{ object: 'text' }, { object: 'inline' }] }],
      marks: [{ match: [{ type: 'bold' }, { type: 'italic' }] }],
      normalize: (_, error) => {
        captureAsRavenWarning(error);
      },
    },
    'unordered-list': {
      nodes: [{ match: { type: 'list-item' } }],
      normalize: (_, error) => {
        captureAsRavenWarning(error);
      },
    },
    'ordered-list': {
      nodes: [{ match: { type: 'list-item' } }],
      normalize: (_, error) => {
        captureAsRavenWarning(error);
      },
    },
    'list-item': {
      nodes: [{ match: [{ object: 'text' }, { object: 'inline' }] }],
      marks: [{ match: [{ type: 'bold' }, { type: 'italic' }] }],
      normalize: (_, error) => {
        captureAsRavenWarning(error);
      },
    },
    // tslint:disable-next-line:object-literal-key-quotes
    header: {
      nodes: [{ match: [{ object: 'text' }, { object: 'inline' }] }],
      marks: [],
      normalize: (_, error) => {
        captureAsRavenWarning(error);
      },
    },
    // tslint:disable-next-line:object-literal-key-quotes
    embed: {
      isVoid: true,
      data: {
        // TODO: test that it is a valid embed code?
        code: (code) => !!code,
      },
      normalize: (_, error) => {
        captureAsRavenWarning(error);
      },
    },
    // tslint:disable-next-line:object-literal-key-quotes
    image: {
      isVoid: true,
      data: {
        src: (src) => !!src,
      },
      normalize: (_, error) => {
        captureAsRavenWarning(error);
      },
    },
  },
  inlines: {
    link: {
      nodes: [{ match: { object: 'text' } }],
      normalize: (_, error) => {
        captureAsRavenWarning(error);
      },
    },
  },
};

function captureAsRavenWarning(error: Slate.SlateError) {
  Raven.captureException(`RichTextEditor schema error ${error.message}`, {
    level: 'warning',
    extra: {
      node: error.node && JSON.stringify((error.node as Slate.Node).toJS()),
      child: error.child && JSON.stringify((error.child as Slate.Node).toJS()),
      parent: error.parent && JSON.stringify((error.parent as Slate.Node).toJS()),
    },
  });
}
