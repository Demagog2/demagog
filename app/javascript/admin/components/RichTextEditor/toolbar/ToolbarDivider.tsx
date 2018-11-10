import * as React from 'react';

import { IToolbarItem } from './index';

export default function ToolbarDivider(): IToolbarItem {
  return {
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
}
