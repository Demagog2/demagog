import React, { useState } from 'react';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { Query } from 'react-apollo';
import { GetSources } from '../../../queries/queries';
import Loading from '../../Loading';
import Error from '../../Error';
import type {
  GetSources as GetSourcesQuery,
  GetSourcesVariables as GetSourcesQueryVariables,
} from '../../../operation-result-types';
import { cx } from 'emotion';
import { SearchInput } from '../../forms/controls/SearchInput';

export function SelectSourceDialog(props: {
  isOpen: boolean;
  onSelect: (sourceId: string) => any;
  onCancel: () => any;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Dialog
      icon="inbox"
      isOpen={props.isOpen}
      onClose={props.onCancel}
      title="Vyberte diskuzi s výroky"
    >
      <div className={Classes.DIALOG_BODY}>
        <Query<GetSourcesQuery, GetSourcesQueryVariables>
          query={GetSources}
          variables={{ name: searchTerm }}
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

            return (
              <div>
                <div style={{ marginBottom: 15 }}>
                  <SearchInput
                    autoFocus
                    placeholder="Hledat dle názvu..."
                    onChange={setSearchTerm}
                    value={searchTerm}
                  />
                </div>

                {searchTerm === '' ? 'Posledních 10 diskuzí' : 'Nalezené diskuze'}

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
                              onClick={() => props.onSelect(source.id)}
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
          <Button intent={Intent.NONE} onClick={props.onCancel} text="Zavřít" />
        </div>
      </div>
    </Dialog>
  );
}
