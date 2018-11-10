import * as React from 'react';

import * as Slate from 'slate';

interface IToolbarItemRenderProps {
  onCommand: (command: (editor: Slate.Editor) => void) => void;
  value: Slate.Value;
}

interface IToolbarItem {
  renderItem: (props: IToolbarItemRenderProps) => React.ReactNode;
}

export { IToolbarItem, IToolbarItemRenderProps };
