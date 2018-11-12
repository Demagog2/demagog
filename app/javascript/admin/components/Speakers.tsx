/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Card, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetSpeakersQuery as GetSpeakersQueryResult,
  GetSpeakersQueryVariables,
} from '../operation-result-types';
import { DeleteSpeaker } from '../queries/mutations';
import { GetSpeakers } from '../queries/queries';
import { displayDate } from '../utils';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import SpeakerAvatar from './SpeakerAvatar';

class GetSpeakersQuery extends Query<GetSpeakersQueryResult, GetSpeakersQueryVariables> {}

interface IProps extends DispatchProp<any> {}

interface IState {
  search: string;
  confirmDeleteModalSpeakerId: string | null;
}

class Speakers extends React.Component<IProps, IState> {
  public state = {
    search: '',
    confirmDeleteModalSpeakerId: null,
  };

  private onSearchChange = (search: string) => {
    this.setState({ search });
  };

  private showConfirmDeleteModal = (confirmDeleteModalSpeakerId: string) => () => {
    this.setState({ confirmDeleteModalSpeakerId });
  };

  private hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalSpeakerId: null });
  };

  private onDeleted = () => {
    this.props.dispatch(addFlashMessage('Osoba byla úspěšně smazána.', 'success'));
    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání osoby', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalSpeakerId } = this.state;

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['speakers:edit']}>
          <div style={{ float: 'right' }}>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/speakers/new"
            >
              Přidat novou osobu
            </Link>
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Lidé</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle jména…"
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <GetSpeakersQuery query={GetSpeakers} variables={{ name: this.state.search }}>
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

            const confirmDeleteModalSpeaker = props.data.speakers.find(
              (s) => s.id === confirmDeleteModalSpeakerId,
            );

            return (
              <div style={{ marginTop: 15 }}>
                {confirmDeleteModalSpeaker && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat osobu ${confirmDeleteModalSpeaker.first_name} ${
                      confirmDeleteModalSpeaker.last_name
                    }?`}
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeleteSpeaker}
                    mutationProps={{
                      variables: { id: confirmDeleteModalSpeakerId },
                      refetchQueries: [
                        { query: GetSpeakers, variables: { name: this.state.search } },
                      ],
                      onCompleted: this.onDeleted,
                      onError: this.onDeleteError,
                    }}
                  />
                )}

                {props.data.speakers.map((speaker) => (
                  <Card key={speaker.id} style={{ marginBottom: 15 }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: '0 0 106px', marginRight: 15 }}>
                        <SpeakerAvatar
                          avatar={speaker.avatar}
                          first_name={speaker.first_name}
                          last_name={speaker.last_name}
                        />
                      </div>
                      <div style={{ flex: '1 1' }}>
                        <Authorize permissions={['speakers:edit']}>
                          <div style={{ float: 'right', display: 'flex' }}>
                            <Link
                              to={`/admin/speakers/edit/${speaker.id}`}
                              className={classNames(
                                Classes.BUTTON,
                                Classes.iconClass(IconNames.EDIT),
                              )}
                            >
                              Upravit
                            </Link>
                            <Button
                              icon={IconNames.TRASH}
                              onClick={this.showConfirmDeleteModal(speaker.id)}
                              style={{ marginLeft: 7 }}
                              title="Smazat"
                            />
                          </div>
                        </Authorize>

                        <h5 className={Classes.HEADING}>
                          {speaker.first_name} {speaker.last_name}
                        </h5>

                        <ul className={Classes.LIST_UNSTYLED}>
                          <li>
                            <span className={Classes.TEXT_MUTED}>Respektovaný odkaz: </span>
                            <p>
                              {speaker.website_url ? (
                                <a href={speaker.website_url}>{speaker.website_url}</a>
                              ) : (
                                'Nevyplněn'
                              )}
                            </p>
                          </li>
                          <li>
                            <span className={Classes.TEXT_MUTED}>
                              Příslušnost ke skupinám/stranám:{' '}
                            </span>
                            <p>
                              {speaker.memberships.map((m) => (
                                <React.Fragment key={m.id}>
                                  <span>
                                    {m.body.short_name}
                                    {' — od '}
                                    {m.since ? displayDate(m.since) : 'nevyplněno'}
                                    {' do '}
                                    {m.until ? displayDate(m.until) : 'nevyplněno'}
                                  </span>
                                  <br />
                                </React.Fragment>
                              ))}

                              {speaker.memberships.length === 0 &&
                                'Není členem žádné skupiny či strany'}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}

                {props.data.speakers.length === 0 &&
                  this.state.search !== '' && (
                    <p>Nenašli jsme žádnou osobu se jménem „{this.state.search}‟.</p>
                  )}
              </div>
            );
          }}
        </GetSpeakersQuery>
      </div>
    );
  }
}

export default connect()(Speakers);
