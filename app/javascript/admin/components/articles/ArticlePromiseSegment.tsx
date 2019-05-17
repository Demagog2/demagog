import * as React from 'react';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { css } from 'emotion';
import { Query } from 'react-apollo';

import {
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables,
} from '../../operation-result-types';
import { GetSourceStatements } from '../../queries/queries';
import DemagogczWidget from '../DemagogczWidget';
import Error from '../Error';
import Loading from '../Loading';

interface IPromiseSegment {
  id: string | undefined | null;
  segment_type: string;
  promise_url: string | null;
}

interface IProps {
  segment: IPromiseSegment;
  onRemove(): void;
  onChange(segment: IPromiseSegment): void;
}

interface IState {
  isSelectPromiseDialogOpen: boolean;
}

export default class ArticlePromiseSegment extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isSelectPromiseDialogOpen: !props.segment.promise_url,
    };
  }

  public render() {
    return (
      <div
        className={css`
          margin-bottom: 20px;
          position: relative;
        `}
      >
        <SelectPromiseDialog
          isOpen={this.state.isSelectPromiseDialogOpen}
          onCancel={() => {
            this.props.onRemove();
            this.toggleDialog();
          }}
          onSelect={(promiseUrl) => {
            this.props.onChange({
              ...this.props.segment,
              promise_url: promiseUrl,
            });
            this.toggleDialog();
          }}
        />

        <div
          className={css`
            position: absolute;
            top: 2px;
            left: -45px;
          `}
        >
          <Button icon={IconNames.TRASH} onClick={this.props.onRemove} title="Odstranit segment" />
        </div>

        {this.props.segment.promise_url && <DemagogczWidget url={this.props.segment.promise_url} />}
      </div>
    );
  }

  public toggleDialog = () =>
    this.setState({ isSelectPromiseDialogOpen: !this.state.isSelectPromiseDialogOpen });
}

const PROMISES_SOURCE_ID = 562; // Sliby vlady Andreje Babise

class SelectPromiseDialog extends React.Component<{
  isOpen: boolean;
  onSelect(promiseUrl: string): any;
  onCancel(): any;
}> {
  public render() {
    return (
      <Dialog
        icon="inbox"
        isOpen={this.props.isOpen}
        onClose={this.props.onCancel}
        title="Vyberte slib vlády Andreje Babiše"
      >
        <div className={Classes.DIALOG_BODY}>
          <Query<GetSourceStatementsQuery, GetSourceStatementsQueryVariables>
            query={GetSourceStatements}
            variables={{ sourceId: PROMISES_SOURCE_ID, includeUnpublished: true }}
          >
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

              const sorted = [...data.statements];
              sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

              return (
                <div
                  className={css`
                    overflow-x: hidden;
                    overflow-y: auto;
                    max-height: 400px;
                  `}
                >
                  <div>
                    {sorted.map((statement) => (
                      <div key={statement.id}>
                        <strong>{statement.title}</strong>
                        <Button
                          intent={Intent.PRIMARY}
                          onClick={() =>
                            this.props.onSelect(
                              `/sliby/druha-vlada-andreje-babise/embed/${statement.id}?logo=hide`,
                            )
                          }
                          text="Vybrat"
                        />
                      </div>
                    ))}
                  </div>
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
