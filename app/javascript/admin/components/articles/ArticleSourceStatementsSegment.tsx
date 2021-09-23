import * as React from 'react';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { css, cx } from 'emotion';
import { Query } from 'react-apollo';

import {
  GetSources as GetSourcesQuery,
  GetSourceStatements as GetSourceStatementsQuery,
  GetSourceStatementsVariables as GetSourceStatementsQueryVariables,
  GetSourcesVariables as GetSourcesQueryVariables,
} from '../../operation-result-types';
import { GetSources, GetSourceStatements } from '../../queries/queries';
import Error from '../Error';
import Loading from '../Loading';

const VERACITY_COLORS = {
  true: '#0060ff',
  untrue: '#eb1d2b',
  misleading: '#ffba00',
  unverifiable: '#9dbaeb',
};

interface ISourceStatementsSegment {
  id: string;
  segment_type: string;
  source_id: string | null;
}

interface IProps {
  segment: ISourceStatementsSegment;
  onRemove(): void;
  onChange(segment: ISourceStatementsSegment): void;
}

interface IState {
  isSelectSourceDialogOpen: boolean;
}

export default class ArticleSourceStatementsSegment extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isSelectSourceDialogOpen: !props.segment.source_id,
    };
  }

  public toggleDialog = () =>
    this.setState({ isSelectSourceDialogOpen: !this.state.isSelectSourceDialogOpen });

  public render() {
    return (
      <div style={{ marginBottom: 20, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: -45,
          }}
        >
          <Button icon={IconNames.TRASH} onClick={this.props.onRemove} title="Odstranit segment" />
        </div>
        {this.props.segment.source_id && (
          <>
            <h2
              style={{
                fontFamily: 'Lato, sans-serif',
                color: '#3c325c',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.5px',
                margin: '20px 0 10px 0',
              }}
            >
              Výroky
            </h2>
            <StatementsPreview sourceId={this.props.segment.source_id} />
          </>
        )}
        <SelectSourceDialog
          isOpen={this.state.isSelectSourceDialogOpen}
          onCancel={() => {
            this.props.onRemove();
            this.toggleDialog();
          }}
          onSelect={(sourceId) => {
            this.props.onChange({
              ...this.props.segment,
              source_id: sourceId,
            });
            this.toggleDialog();
          }}
        />
      </div>
    );
  }
}

interface IStatementsPreviewProps {
  sourceId: string;
}

function StatementsPreview({ sourceId }: IStatementsPreviewProps) {
  return (
    <Query<GetSourceStatementsQuery, GetSourceStatementsQueryVariables>
      query={GetSourceStatements}
      variables={{ sourceId: parseInt(sourceId, 10), includeUnpublished: false }}
    >
      {(props) => {
        if (props.loading) {
          return <Loading />;
        }

        if (!props.data) {
          return null;
        }

        if (props.data.statements.length === 0) {
          return <div>Vybraná diskuze zatím nemá žádné zveřejněné výroky.</div>;
        }

        return (
          <div>
            {props.data.statements.map((statement) => (
              <div
                key={statement.id}
                className={css`
                  font-family: Lato, sans-serif;
                  display: flex;
                  margin-top: 20px;
                  margin-bottom: 50px;
                  font-size: 16px;
                  line-height: 1.5;
                `}
              >
                <div
                  className={css`
                    flex: 0 0 80px;
                    text-align: center;
                  `}
                >
                  <div
                    className={css`
                      border-radius: 50%;
                      width: 80px;
                      height: 80px;
                      overflow: hidden;
                      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
                    `}
                  >
                    <img
                      src={statement.sourceSpeaker.speaker.avatar || ''}
                      className={css`
                        width: 100%;
                      `}
                    />
                  </div>
                  <div
                    className={css`
                      color: #3c325c;
                      margin-top: 10px;
                      font-size: 18px;
                      font-weight: 700;
                    `}
                  >
                    {statement.sourceSpeaker.firstName} {statement.sourceSpeaker.lastName}
                  </div>
                </div>

                <div
                  className={css`
                    flex: 1 1 auto;
                  `}
                >
                  <blockquote
                    className={css`
                      position: relative;
                      border-radius: 5px;
                      background: ${statement.important ? '#f3dbd3' : '#d7e5ef'};
                      padding: 10px 15px;
                      margin: 0 0 0 15px;
                      padding-right: ${statement.important ? '45px' : '15px'};
                    `}
                  >
                    {statement.content}

                    {statement.important && (
                      <span
                        className={css`
                          position: absolute;
                          right: 0;
                          top: 50%;

                          margin-top: -29px;
                          padding: 0 16px;

                          font-size: 45px;
                          font-weight: 700;
                          color: #f26538;
                        `}
                      >
                        !
                      </span>
                    )}
                  </blockquote>

                  <div>
                    {statement.assessment.veracity && (
                      <p
                        className={css`
                          font-size: 16px;
                          font-weight: 700;
                          color: ${VERACITY_COLORS[statement.assessment.veracity.key]};
                          text-transform: uppercase;
                          margin: 13px 0 0 15px;
                        `}
                      >
                        {statement.assessment.veracity.name}
                      </p>
                    )}

                    {statement.assessment.shortExplanation && (
                      <p
                        className={css`
                          margin: 5px 0 0 15px;
                        `}
                      >
                        {statement.assessment.shortExplanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </Query>
  );
}

class SelectSourceDialog extends React.Component<{
  isOpen: boolean;
  onSelect(sourceId: string): any;
  onCancel(): any;
}> {
  public render() {
    return (
      <Dialog
        icon="inbox"
        isOpen={this.props.isOpen}
        onClose={this.props.onCancel}
        title="Vyberte diskuzi s výroky"
      >
        <div className={Classes.DIALOG_BODY}>
          <Query<GetSourcesQuery, GetSourcesQueryVariables> query={GetSources}>
            {({ data, loading, error }) => {
              if (loading) {
                return <Loading />;
              }

              if (error) {
                return <Error error={error} />;
              }

              if (!data) {
                return null;
              }

              return (
                <div>
                  Posledních 10 diskuzí
                  <table className={cx(Classes.HTML_TABLE, Classes.INTERACTIVE)}>
                    <thead>
                      <tr>
                        <th>Diskuze</th>
                        <th>Pořad</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {data.sources.map((source) => {
                        return (
                          <tr key={source.id}>
                            <td>{source.name}</td>
                            <td>{source.medium && source.medium.name}</td>
                            <td>
                              <Button
                                intent={Intent.PRIMARY}
                                onClick={() => this.props.onSelect(source.id)}
                                text="Vybrat"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }}
          </Query>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent={Intent.NONE} onClick={this.props.onCancel} text="Zavřít" />
          </div>
        </div>
      </Dialog>
    );
  }
}
