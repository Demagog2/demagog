import * as React from 'react';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { cx } from 'emotion';
import { Query } from 'react-apollo';

import { GetSourcesQuery, GetSourcesQueryVariables } from '../../operation-result-types';
import { GetSources } from '../../queries/queries';
import Error from '../Error';
import Loading from '../Loading';

class GetSourcesQueryComponent extends Query<GetSourcesQuery, GetSourcesQueryVariables> {}

export class SelectStatementsModal extends React.Component<{
  isOpen: boolean;
  toggleDialog(): void;
  onSelect(statements: string[]): void;
}> {
  public render() {
    return (
      <Dialog
        icon="inbox"
        isOpen={this.props.isOpen}
        onClose={this.props.toggleDialog}
        title="Vyberte výroky"
      >
        <div className={Classes.DIALOG_BODY}>
          <GetSourcesQueryComponent query={GetSources}>
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
                <table className={cx(Classes.HTML_TABLE, Classes.INTERACTIVE)}>
                  <thead>
                    <tr>
                      <th>Název</th>
                      <th>Výroky</th>
                      <th>Vybrat</th>
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
                              onClick={() =>
                                this.props.onSelect(
                                  source.statements.map((statement) => statement.id),
                                )
                              }
                              text="Vybrat"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            }}
          </GetSourcesQueryComponent>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent={Intent.NONE} onClick={this.props.toggleDialog} text="Zavřít" />
          </div>
        </div>
      </Dialog>
    );
  }
}
