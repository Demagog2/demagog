import type { ISourceViewModel } from './presenters/SourceDetailPresenter';
import { EmptySourceDetail } from './EmptySourceDetail';
import Authorize from '../Authorize';
import { Button, Classes, Menu, MenuDivider, MenuItem, Popover, Position } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { IconNames } from '@blueprintjs/icons';
import { SpeakersStats } from './speaker-stats-report/view/SpeakersStats';
import StatementCard from '../StatementCard';
import { GetSource, GetSourceStatements } from '../../queries/queries';
import * as React from 'react';

export function SourceStatements(props: {
  source: ISourceViewModel;
  applyStatementFilter: (key: string) => void;
  onMassStatementsPublish: () => void;
  onRemoveStatementsFilter: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  if (props.source.statementsTotalCount === 0) {
    return (
      <div style={{ marginTop: 50 }}>
        <EmptySourceDetail source={props.source} />
      </div>
    );
  }

  // TODO: Pass filtered statements to the view
  const statementsToDisplay = props.source.filteredStatements;

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
                <Button style={{ marginLeft: 7 }} onClick={props.onMassStatementsPublish}>
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
              disabled={!props.source.hasActiveFilter}
              text={`Všechny výroky (${props.source.statementsTotalCount})`}
              onClick={props.onRemoveStatementsFilter}
            />

            {props.source.filters.map((filterOrGroup) =>
              filterOrGroup.type === 'filter-group'
                ? (
                <>
                  <MenuDivider title={filterOrGroup.label} />
                  {filterOrGroup.filters.map((filter) => (
                    <MenuItem
                      key={filter.key}
                      active={filter.active}
                      text={filter.label}
                      onClick={() => { props.applyStatementFilter(filter.key); }}
                    />
                  ))}
                </>
                  )
                : (
                <MenuItem
                  key={filterOrGroup.key}
                  active={filterOrGroup.active}
                  text={filterOrGroup.label}
                  onClick={() => { props.applyStatementFilter(filterOrGroup.key); }}
                />
                  ),
            )}
          </div>
          <SpeakersStats statsReports={props.source.speakerStats} />
        </div>
        <div style={{ flex: '1 1' }}>
          {statementsToDisplay.map((statement) => (
            <StatementCard
              key={statement.id}
              statement={statement}
              refetchQueriesAfterDelete={[
                {
                  query: GetSource,
                  variables: { id: props.source.id },
                },
                {
                  query: GetSourceStatements,
                  variables: {
                    sourceId: props.source.id,
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
