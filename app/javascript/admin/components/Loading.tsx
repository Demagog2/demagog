import * as React from 'react';

import { Spinner } from '@blueprintjs/core';

export default function Loading() {
  return (
    <div style={{ margin: '30px auto 0 auto', width: 50 }}>
      <div>
        <Spinner />
      </div>
    </div>
  );
}
