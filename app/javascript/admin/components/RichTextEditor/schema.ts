import * as Slate from 'slate';
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations';
import * as yup from 'yup';

export default Slate.Schema.fromJSON({
  document: {
    nodes: [{ types: ['paragraph', 'image', 'embed'] }],

    // We want to make sure there is a line after embed or image, because users
    // cannot create new line themselves
    last: { types: ['paragraph'] },
    normalize: (change, reason, { node }) => {
      switch (reason) {
        case LAST_CHILD_TYPE_INVALID: {
          const paragraph = Slate.Block.create('paragraph');
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    },
  },
  blocks: {
    paragraph: {
      nodes: [{ objects: ['text', 'inline'] }],
      marks: [{ type: 'bold' }, { type: 'italic' }, { type: 'underlined' }],
    },
    embed: {
      isVoid: true,
      data: {
        // TODO: test that it is a valid embed code?
        code: (code) => !!code,
      },
    },
    image: {
      isVoid: true,
      data: {
        src: (src) =>
          src &&
          yup
            .string()
            .url()
            .isValidSync(src),
      },
    },
  },
  inlines: {
    link: {
      nodes: [{ objects: ['text'] }],
    },
  },
} as any);
