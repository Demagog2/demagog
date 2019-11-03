/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetMedia as GetMediaQueryResult,
  GetMediaVariables as GetMediaQueryVariables,
} from '../../operation-result-types';
import { DeleteMedium } from '../../queries/mutations';
import { GetMedia } from '../../queries/queries';
import Authorize from '../Authorize';
import { SearchInput } from '../forms/controls/SearchInput';
import Loading from '../Loading';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

interface IProps extends DispatchProp<any> {}

interface IState {
  search: string;
  confirmDeleteModalMediumId: string | null;
}

class Media extends React.Component<IProps, IState> {
  public state = {
    search: '',
    confirmDeleteModalMediumId: null,
  };

  private onSearchChange = (search: string) => {
    this.setState({ search });
  };

  private showConfirmDeleteModal = (confirmDeleteModalMediumId: string) => () => {
    this.setState({ confirmDeleteModalMediumId });
  };

  private hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalMediumId: null });
  };

  private onDeleted = () => {
    this.props.dispatch(addFlashMessage('Pořad byl úspěšně smazán.', 'success'));
    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    if (error.message.match(/cannot be deleted if it is linked to some sources/)) {
      this.props.dispatch(
        addFlashMessage(
          'Pořad nelze smazat, protože je pro něj vytvořena už nějaká diskuze s výroky.',
          'warning',
        ),
      );
      return;
    }

    this.props.dispatch(addFlashMessage('Doško k chybě při mazání pořadu.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalMediumId } = this.state;

    return (
      <div className="media" style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['media:edit']}>
          <div style={{ float: 'right' }}>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/media/new"
            >
              Přidat pořad
            </Link>
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Pořady</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle názvu..."
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <Query<GetMediaQueryResult, GetMediaQueryVariables>
          query={GetMedia}
          variables={{ name: this.state.search }}
        >
          {(props) => {
            if (props.loading) {
              return <Loading />;
            }

            if (props.error) {
              return <h1>{props.error}</h1>;
            }

            if (!props.data) {
              return null;
            }

            const confirmDeleteModalMedium = props.data.media.find(
              (s) => s.id === confirmDeleteModalMediumId,
            );

            const mediaLength = props.data.media.length;

            return (
              <div style={{ marginTop: 15 }}>
                {confirmDeleteModalMedium && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat pořad „${confirmDeleteModalMedium.name}“?`}
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeleteMedium}
                    mutationProps={{
                      variables: { id: confirmDeleteModalMediumId },
                      refetchQueries: [
                        {
                          query: GetMedia,
                          variables: {
                            name: this.state.search,
                          },
                        },
                      ],
                      onCompleted: this.onDeleted,
                      onError: this.onDeleteError,
                    }}
                  />
                )}

                {mediaLength > 0 && (
                  <React.Fragment>
                    <table
                      className={classNames(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
                      style={{ width: '100%' }}
                    >
                      <thead>
                        <tr>
                          <th scope="col">Název pořadu</th>
                          <th scope="col" />
                        </tr>
                      </thead>
                      <tbody>
                        {props.data.media.map((medium) => (
                          <tr key={medium.id}>
                            <td>{medium.name}</td>
                            <td>
                              <div style={{ display: 'flex' }}>
                                <Link
                                  to={`/admin/media/edit/${medium.id}`}
                                  className={classNames(
                                    Classes.BUTTON,
                                    Classes.iconClass(IconNames.EDIT),
                                  )}
                                >
                                  Upravit
                                </Link>
                                <Button
                                  icon={IconNames.TRASH}
                                  style={{ marginLeft: 7 }}
                                  onClick={this.showConfirmDeleteModal(medium.id)}
                                  title="Smazat"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </React.Fragment>
                )}

                {mediaLength === 0 && this.state.search !== '' && (
                  <p>Nenašli jsme žádný pořad s názvem „{this.state.search}“.</p>
                )}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default connect()(Media);
