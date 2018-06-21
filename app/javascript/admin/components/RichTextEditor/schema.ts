import * as Slate from 'slate';

export default Slate.Schema.fromJSON({
  document: {
    nodes: [{ types: ['paragraph'] }],
  },
  blocks: {
    paragraph: {
      nodes: [{ objects: ['text', 'inline'] }],
      marks: [{ type: 'bold' }, { type: 'italic' }, { type: 'underlined' }],
    },
  },
  inlines: {
    link: {
      nodes: [{ objects: ['text'] }],
    },
  },
} as any);
