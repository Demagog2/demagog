import * as Slate from 'slate';

export default Slate.Schema.fromJSON({
  document: {
    nodes: [{ types: ['paragraph'] }],
  },
  blocks: {
    paragraph: {
      nodes: [{ objects: ['text'] }],
      marks: [{ type: 'bold' }, { type: 'italic' }, { type: 'underlined' }],
    },
  },
} as any);
