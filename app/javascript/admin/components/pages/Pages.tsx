import { Button, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import * as React from 'react';
import { Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  GetPagesQuery as GetPagesQueryResult,
  GetPagesQueryVariables,
} from '../../operation-result-types';
import { GetPages } from '../../queries/queries';
import { SearchInput } from '../forms/controls/SearchInput';

import { ApolloError } from '../../../../../node_modules/apollo-client';
import { addFlashMessage } from '../../actions/flashMessages';
import { DeletePage } from '../../queries/mutations';
import Authorize from '../Authorize';
import Error from '../Error';
import Loading from '../Loading';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

// Lets just load all of them, there shouldn't be hundreds of them
const PAGES_PER_PAGE = 100;

interface IProps {
  dispatch: Dispatch;
}

interface IState {
  search: string;
  confirmDeleteModalPageId: string | null;
}

class GetPagesQuery extends Query<GetPagesQueryResult, GetPagesQueryVariables> {}

class Pages extends React.Component<IProps, IState> {
  public state = {
    search: '',
    confirmDeleteModalPageId: null,
  };

  public onSearchChange = (search: string) => this.setState({ search });

  private showConfirmDeleteModal = (confirmDeleteModalPageId: string) => () => {
    this.setState({ confirmDeleteModalPageId });
  };

  private hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalPageId: null });
  };

  private onDeleted = () => {
    this.props.dispatch(addFlashMessage('Stránka byl úspěšně smazána.', 'success'));
    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání stránky.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalPageId } = this.state;

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['pages:edit']}>
          <div style={{ float: 'right' }}>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/pages/new"
            >
              Přidat stránku
            </Link>
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Stránky</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle titulku…"
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <GetPagesQuery
          query={GetPages}
          variables={{ title: this.state.search, limit: PAGES_PER_PAGE, offset: 0 }}
        >
          {(props) => {
            if (props.loading) {
              return <Loading />;
            }

            if (props.error) {
              return <Error error={props.error} />;
            }

            if (!props.data) {
              return null;
            }

            const confirmDeleteModalPage = props.data.pages.find(
              (s) => s.id === confirmDeleteModalPageId,
            );

            return (
              <div style={{ marginTop: 15 }}>
                {confirmDeleteModalPage && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat stránku „${confirmDeleteModalPage.title}‟?`}
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeletePage}
                    mutationProps={{
                      variables: { id: confirmDeleteModalPageId },
                      refetchQueries: [
                        {
                          query: GetPages,
                          variables: {
                            title: this.state.search,
                            limit: PAGES_PER_PAGE,
                            offset: 0,
                          },
                        },
                      ],
                      onCompleted: this.onDeleted,
                      onError: this.onDeleteError,
                    }}
                  />
                )}

                <table
                  className={classNames(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
                  style={{ width: '100%' }}
                >
                  <thead>
                    <tr>
                      <th scope="col">Titulek</th>
                      <th scope="col">Stav</th>
                      <th scope="col">Odkaz</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {props.data.pages.map((page) => {
                      return (
                        <tr key={page.id}>
                          <td>{page.title}</td>
                          <td>
                            {page.published ? (
                              'Zveřejněná'
                            ) : (
                              <span className={Classes.TEXT_MUTED}>Nezveřejněná</span>
                            )}
                          </td>
                          <td>
                            <a href={`/${page.slug}`}>Odkaz</a>
                          </td>
                          <td>
                            <div style={{ display: 'flex' }}>
                              <Link
                                to={`/admin/pages/edit/${page.id}`}
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
                                onClick={this.showConfirmDeleteModal(page.id)}
                                title="Smazat"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }}
        </GetPagesQuery>
      </div>
    );
  }
}

export default connect()(Pages);
