import * as React from 'react';

import * as Slate from 'slate';

interface IProps {
  value: object | null;
}

class RichTextEditor extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      value: Slate.Value.fromJSON(props.value || DEFAULT_VALUE_JSON),
    };
  }

  public render() {
    return <div>rich text</div>;
  }
}

// TODO
const DEFAULT_VALUE_JSON = {};

export default RichTextEditor;
