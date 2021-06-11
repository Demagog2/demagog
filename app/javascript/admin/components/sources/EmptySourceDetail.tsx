import React from 'react';
import { Link } from 'react-router-dom';
import { Classes, NonIdealState } from '@blueprintjs/core';

export function EmptySourceDetail(props: { source: { id: string } }) {
  return (
    <NonIdealState title="Zatím tu nejsou žádné výroky">
      <Link
        to={`/admin/sources/${props.source.id}/statements-from-transcript`}
        className={Classes.BUTTON}
      >
        Přidat výroky výběrem z přepisu
      </Link>
      <div style={{ margin: '5px 0' }}>nebo</div>
      <Link to={`/admin/sources/${props.source.id}/statements/new`} className={Classes.BUTTON}>
        Přidat výrok ručně
      </Link>
    </NonIdealState>
  );
}
