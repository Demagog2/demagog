import * as React from 'react';

import * as Slate from 'slate';

interface IToolbarItemRenderProps {
  onChange: (change: Slate.Change) => void;
  value: Slate.Value;
}

export interface IToolbarItem {
  renderItem: (props: IToolbarItemRenderProps) => React.ReactNode;
}

export const toolbarDivider: IToolbarItem = {
  renderItem() {
    return (
      <span
        style={{
          borderLeft: '1px solid #ced4da',
          marginTop: -6,
          marginBottom: -12,
          marginLeft: 5,
          marginRight: 5,
          display: 'inline-block',
          height: 36,
        }}
      />
    );
  },
};
