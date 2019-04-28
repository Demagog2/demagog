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
import { GetMediaPersonalitiesQuery as GetMediaQueryResult } from '../../operation-result-types';
import { DeleteMediaPersonality } from '../../queries/mutations';
import { GetMediaPersonalities } from '../../queries/queries';
import Authorize from '../Authorize';
import { SearchInput } from '../forms/controls/SearchInput';
import Loading from '../Loading';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

class GetMediaPersonalitiesQuery extends Query<GetMediaQueryResult> {}

interface IProps extends DispatchProp<any> {}

interface IState {
  search: string;
  confirmDeleteModalMediaPersonalityId: string | null;
}

class Media extends React.Component<IProps, IState> {
  public state = {
    search: '',
    confirmDeleteModalMediaPersonalityId: null,
  };

  private onSearchChange = (search: string) => {
    this.setState({ search });
  };

  private showConfirmDeleteModal = (confirmDeleteModalMediaPersonalityId: string) => () => {
    this.setState({ confirmDeleteModalMediaPersonalityId });
  };

  private hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalMediaPersonalityId: null });
  };

  private onDeleted = () => {
    this.props.dispatch(addFlashMessage('Moderátor byl úspěšně smazán.', 'success'));
    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    if (error.message.match(/cannot be deleted if it is linked to some sources/)) {
      this.props.dispatch(
        addFlashMessage(
          'Moderátory nelze smazat, protože jsou už přiřazeni k nějaké diskuzi s výroky.',
          'warning',
        ),
      );
      return;
    }

    this.props.dispatch(addFlashMessage('Doško k chybě při mazání moderátora.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalMediaPersonalityId } = this.state;

    return (
      <div className="media" style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['media-personalities:edit']}>
          <div style={{ float: 'right' }}>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/media-personalities/new"
            >
              Přidat moderátory
            </Link>
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Moderátoři</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle jména..."
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <GetMediaPersonalitiesQuery
          query={GetMediaPersonalities}
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

            const confirmDeleteModalMediaPersonality = props.data.mediaPersonalities.find(
              (s) => s.id === confirmDeleteModalMediaPersonalityId,
            );

            const mediaLength = props.data.mediaPersonalities.length;

            return (
              <div style={{ marginTop: 15 }}>
                {confirmDeleteModalMediaPersonality && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat moderátora/ku „${
                      confirmDeleteModalMediaPersonality.name
                    }‟?`}
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeleteMediaPersonality}
                    mutationProps={{
                      variables: { id: confirmDeleteModalMediaPersonalityId },
                      refetchQueries: [
                        {
                          query: GetMediaPersonalities,
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
                          <th scope="col" />
                          <th scope="col" />
                        </tr>
                      </thead>
                      <tbody>
                        {props.data.mediaPersonalities.map((mediaPersonality) => (
                          <tr key={mediaPersonality.id}>
                            <td>{mediaPersonality.name}</td>
                            <td>
                              <div style={{ display: 'flex' }}>
                                <Link
                                  to={`/admin/media-personalities/edit/${mediaPersonality.id}`}
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
                                  onClick={this.showConfirmDeleteModal(mediaPersonality.id)}
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

                {mediaLength === 0 &&
                  this.state.search !== '' && (
                    <p>Nenašli jsme žádné moderátory jména či příjmení „{this.state.search}‟.</p>
                  )}
              </div>
            );
          }}
        </GetMediaPersonalitiesQuery>
      </div>
    );
  }
}

export default connect()(Media);
