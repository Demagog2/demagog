import * as React from 'react';

import { Button, Classes, Menu, Popover, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { cx } from 'emotion';
import { Link } from 'react-router-dom';
import { displayDate } from '../../utils';
import Authorize from '../Authorize';
import Loading from '../Loading';
import type { ISourceViewModel } from './presenters/SourceDetailPresenter';
import { SourceStatements } from './SourceStatements';

interface ISourceDetailProps {
  source: ISourceViewModel;
  loading: boolean;
  onDeleteSource: () => void;
  onMassStatementsPublish: () => void;
  onStatementFiltersUpdate: (field: string) => void;
  onRemoveStatementsFilter: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function SourceDetail(props: ISourceDetailProps) {
  if (props.loading) {
    return <Loading />;
  }

  if (!props.source) {
    return null;
  }

  const source = props.source;

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <div>
        <div style={{ float: 'right' }}>
          <Authorize permissions={['sources:edit']}>
            <Popover
              content={
                <Menu>
                  <Link
                    to={`/admin/sources/edit/${source.id}`}
                    className={cx(Classes.MENU_ITEM, Classes.iconClass(IconNames.EDIT))}
                  >
                    Upravit údaje
                  </Link>
                  <button
                    type="button"
                    className={cx(
                      Classes.MENU_ITEM,
                      Classes.INTENT_DANGER,
                      Classes.iconClass(IconNames.TRASH),
                    )}
                    onClick={props.onDeleteSource}
                  >
                    Smazat…
                  </button>
                </Menu>
              }
              minimal
              position={Position.BOTTOM_LEFT}
            >
              <Button text="Diskuzi…" />
            </Popover>
          </Authorize>
          <Link to="/admin/sources" className={Classes.BUTTON} style={{ marginLeft: 7 }}>
            Zpět na seznam diskuzí
          </Link>
        </div>

        <h2 className={Classes.HEADING}>{source.name}</h2>

        <span>
          {source.medium} ze dne {source.releasedAt ? displayDate(source.releasedAt) : 'neuvedeno'}
          {source.mediaPersonalities && source.mediaPersonalities.length > 0 && (
            <>, {source.mediaPersonalities.join(' & ')}</>
          )}
          {source.sourceUrl && (
            <>
              , <a href={source.sourceUrl}>odkaz</a>
            </>
          )}
          {source.experts && source.experts.length > 0 && (
            <>
              <br />
              {source.experts.length === 1 ? 'Editor: ' : 'Editoři: '}
              {source.experts.join(', ')}
            </>
          )}
        </span>
      </div>

      {/* TODO: Pass filter application to the container */}
      <SourceStatements
        source={source}
        applyStatementFilter={props.onStatementFiltersUpdate}
        onMassStatementsPublish={props.onMassStatementsPublish}
        onRemoveStatementsFilter={props.onRemoveStatementsFilter}
      />
    </div>
  );
}
