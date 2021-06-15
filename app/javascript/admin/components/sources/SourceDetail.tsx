/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Classes, Menu, MenuDivider, MenuItem, Popover, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { cx } from 'emotion';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { ASSESSMENT_STATUS_APPROVED } from '../../constants';

import { GetSource, GetSourceStatements } from '../../queries/queries';
import { displayDate } from '../../utils';
import Authorize from '../Authorize';
import Loading from '../Loading';
import StatementCard from '../StatementCard';
import { EmptySourceDetail } from './EmptySourceDetail';
import { Source } from './model/Source';
import { ISourceViewModel } from './speaker-stats-report/presenters/SourceDetailPresenter';
import { SpeakersStats } from './speaker-stats-report/view/SpeakersStats';

function Statements(props: { source: ISourceViewModel; applyStatementFilter(key: string): void }) {
  const { statementsFilter } = this.state;

  if (props.source.statements.length === 0) {
    return (
      <div style={{ marginTop: 50 }}>
        <EmptySourceDetail source={props.source} />
      </div>
    );
  }

  const statementsToDisplay = props.source.statements.filter((statement) => {
    if (statementsFilter !== null) {
      if (statementsFilter.field === 'verifiedAndUnpublished') {
        return (
          statement.assessment.evaluationStatus === ASSESSMENT_STATUS_APPROVED &&
          statement.published === false
        );
      }

      return get(statement, statementsFilter.field, null) === statementsFilter.value;
    } else {
      return true;
    }
  });

  return (
    <>
      <Authorize permissions={['statements:add', 'statements:sort']}>
        <div style={{ display: 'flex', marginTop: 30 }}>
          <div style={{ flex: '0 0 220px', marginRight: 15 }}>
            <Authorize permissions={['statements:add']}>
              <Popover
                content={
                  <Menu>
                    <Link
                      to={`/admin/sources/${props.source.id}/statements-from-transcript`}
                      className={Classes.MENU_ITEM}
                    >
                      Přidat výroky výběrem z přepisu
                    </Link>
                    <Link
                      to={`/admin/sources/${props.source.id}/statements/new`}
                      className={Classes.MENU_ITEM}
                    >
                      Přidat výrok ručně
                    </Link>
                  </Menu>
                }
                minimal
                position={Position.BOTTOM_LEFT}
              >
                <Button icon={IconNames.PLUS} text="Přidat výrok…" />
              </Popover>
            </Authorize>
          </div>
          <div style={{ flex: '1 1' }}>
            <div style={{ float: 'right' }}>
              <Link to={`/admin/sources/${props.source.id}/stats`} className={Classes.BUTTON}>
                Statistiky
              </Link>
              <Authorize permissions={['statements:edit']}>
                <Link
                  to={`/admin/sources/${props.source.id}/statements-video-marks`}
                  className={Classes.BUTTON}
                  style={{ marginLeft: 7 }}
                >
                  Propojení s videozáznamem
                </Link>
                <Button style={{ marginLeft: 7 }} onClick={this.props.onMassStatementsPublish}>
                  Zveřejnit všechny schválené výroky…
                </Button>
              </Authorize>
              <Authorize permissions={['statements:sort']}>
                <Link
                  to={`/admin/sources/${props.source.id}/statements-sort`}
                  className={Classes.BUTTON}
                  style={{ marginLeft: 7 }}
                >
                  Seřadit výroky
                </Link>
              </Authorize>
            </div>
          </div>
        </div>
      </Authorize>

      <div style={{ display: 'flex', marginTop: 22, marginBottom: 50 }}>
        <div style={{ flex: '0 0 220px', marginRight: 15 }}>
          <div className={Classes.LIST_UNSTYLED}>
            <MenuItem
              active={statementsFilter === null}
              text={`Všechny výroky (${props.source.statements.length})`}
              onClick={this.props.onRemoveStatementsFilter}
            />

            {props.source.filters.map((filterOrGroup) =>
              filterOrGroup.type === 'filter-group' ? (
                <>
                  <MenuDivider title={filterOrGroup.label} />
                  {filterOrGroup.filters.map((filter) => (
                    <MenuItem
                      key={filter.key}
                      active={filter.active}
                      text={filter.label}
                      onClick={() => props.applyStatementFilter(filter.key)}
                    />
                  ))}
                </>
              ) : (
                <MenuItem
                  key={filterOrGroup.key}
                  active={filterOrGroup.active}
                  text={filterOrGroup.label}
                  onClick={() => props.applyStatementFilter(filterOrGroup.key)}
                />
              ),
            )}
          </div>
          <SpeakersStats statsReports={props.source.speakerStats} />;
        </div>
        <div style={{ flex: '1 1' }}>
          {statementsToDisplay.map((statement) => (
            <StatementCard
              key={statement.id}
              statement={statement}
              refetchQueriesAfterDelete={[
                {
                  query: GetSource,
                  variables: { id: parseInt(this.props.match.params.sourceId, 10) },
                },
                {
                  query: GetSourceStatements,
                  variables: {
                    sourceId: parseInt(props.source.id, 10),
                    includeUnpublished: true,
                  },
                },
              ]}
            />
          ))}
          {statementsToDisplay.length === 0 && <p>Vybranému filtru nevyhovují žádné výroky</p>}
        </div>
      </div>
    </>
  );
}

interface ISourceDetailProps {
  source: Source;
  loading: boolean;
  onDeleteSource(): void;
  onMassStatementsPublish(): void;
  onStatementFiltersUpdate(
    field: string,
    value: any,
  ): (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onRemoveStatementsFilter(event: React.MouseEvent<HTMLAnchorElement>): void;
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
          {source.medium?.name} ze dne{' '}
          {source.releasedAt ? displayDate(source.releasedAt) : 'neuvedeno'}
          {source.mediaPersonalities && source.mediaPersonalities.length > 0 && (
            <>, {source.mediaPersonalities.map((p) => p.name).join(' & ')}</>
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
              {source.experts.map((expert) => `${expert.firstName} ${expert.lastName}`).join(', ')}
            </>
          )}
        </span>
      </div>

      <Statements source={source} />
    </div>
  );
}
