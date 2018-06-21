import * as Slate from 'slate';
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations';

export default Slate.Schema.fromJSON({
  document: {
    nodes: [{ types: ['paragraph', 'embed'] }],

    // So there is always a line after embed, because users cannot create new line
    // after embed otherwise
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
        code: () => true,
      },
    },
  },
  inlines: {
    link: {
      nodes: [{ objects: ['text'] }],
    },
  },
} as any);
