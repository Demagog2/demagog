import * as Slate from 'slate';
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations';

export default Slate.Schema.fromJSON({
  document: {
    nodes: [{ types: ['paragraph', 'unordered-list', 'ordered-list', 'image', 'embed', 'header'] }],

    // We want to make sure there is a line after embed or image, because users
    // cannot create new line themselves
    last: { types: ['paragraph'] },
    normalize: (change, reason, { node }) => {
      switch (reason) {
        case LAST_CHILD_TYPE_INVALID: {
          const paragraph = Slate.Block.fromJSON({
            type: 'paragraph',
            nodes: [{ object: 'text', leaves: [{ text: '' }] }],
          } as any);
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    },
  },
  blocks: {
    // tslint:disable-next-line:object-literal-key-quotes
    paragraph: {
      nodes: [{ objects: ['text', 'inline'] }],
      marks: [{ type: 'bold' }, { type: 'italic' }],
    },
    'unordered-list': {
      nodes: [{ types: ['list-item'] }],
    },
    'ordered-list': {
      nodes: [{ types: ['list-item'] }],
    },
    'list-item': {
      nodes: [{ objects: ['text', 'inline'] }],
      marks: [{ type: 'bold' }, { type: 'italic' }],
    },
    // tslint:disable-next-line:object-literal-key-quotes
    header: {
      nodes: [{ objects: ['text', 'inline'] }],
      marks: [],
    },
    // tslint:disable-next-line:object-literal-key-quotes
    embed: {
      isVoid: true,
      data: {
        // TODO: test that it is a valid embed code?
        code: (code) => !!code,
      },
    },
    // tslint:disable-next-line:object-literal-key-quotes
    image: {
      isVoid: true,
      data: {
        src: (src) => !!src,
      },
    },
  },
  inlines: {
    link: {
      nodes: [{ objects: ['text'] }],
    },
  },
} as any);
