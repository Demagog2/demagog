/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { ApolloError } from 'apollo-client';
import { Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetSpeakersQuery as GetSpeakersQueryResult,
  GetSpeakersQueryVariables,
} from '../operation-result-types';
import { DeleteSpeaker } from '../queries/mutations';
import { GetSpeakers } from '../queries/queries';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import SpeakerAvatar from './SpeakerAvatar';

class GetSpeakersQuery extends Query<GetSpeakersQueryResult, GetSpeakersQueryVariables> {}

interface IProps {
  dispatch: Dispatch;
}

interface IState {
  name: string | null;
  confirmDeleteModalSpeakerId: string | null;
}

class Speakers extends React.Component<IProps, IState> {
  public state = {
    name: null,
    confirmDeleteModalSpeakerId: null,
  };

  private onSearchChange = (name: string) => {
    this.setState({ name });
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
      <div role="main" style={{ marginTop: 15 }}>
        <Authorize permissions={['speakers:edit']}>
          <div className="float-right">
            <Link className="btn btn-primary" to="/admin/speakers/new">
              Přidat novou osobu
            </Link>
          </div>
        </Authorize>

        <h3>Lidé</h3>

        <div style={{ marginTop: 25 }}>
          <SearchInput placeholder="Vyhledat politickou osobu" onChange={this.onSearchChange} />
        </div>

        <GetSpeakersQuery query={GetSpeakers} variables={{ name: this.state.name }}>
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
              <div>
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
                        { query: GetSpeakers, variables: { name: this.state.name } },
                      ],
                      onCompleted: this.onDeleted,
                      onError: this.onDeleteError,
                    }}
                  />
                )}

                {props.data.speakers.map((speaker) => (
                  <div className="card" key={speaker.id} style={{ marginBottom: '1rem' }}>
                    <div className="card-body" style={{ display: 'flex' }}>
                      <div style={{ flex: '0 0 106px' }}>
                        <SpeakerAvatar
                          avatar={speaker.avatar}
                          first_name={speaker.first_name}
                          last_name={speaker.last_name}
                        />
                      </div>

                      <div style={{ marginLeft: 15, flex: '1 0' }}>
                        <Authorize permissions={['speakers:edit']}>
                          <div style={{ float: 'right' }}>
                            <Link
                              to={`/admin/speakers/edit/${speaker.id}`}
                              className="btn btn-secondary"
                              style={{ marginRight: 15 }}
                            >
                              Upravit
                            </Link>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={this.showConfirmDeleteModal(speaker.id)}
                            >
                              Smazat
                            </button>
                          </div>
                        </Authorize>

                        <h5 style={{ marginTop: 7 }}>
                          {speaker.first_name} {speaker.last_name}
                        </h5>

                        <dl style={{ marginTop: 20 }}>
                          <dt className="text-muted">
                            <small>RESPEKTOVANÝ ODKAZ</small>
                          </dt>
                          <dd>
                            {speaker.website_url ? (
                              <a href={speaker.website_url}>{speaker.website_url}</a>
                            ) : (
                              'Nevyplněn'
                            )}
                          </dd>

                          <dt className="text-muted">
                            <small>PŘÍSLUŠNOST KE SKUPINÁM/STRANÁM</small>
                          </dt>
                          <dd>
                            {speaker.memberships.map((m) => (
                              <React.Fragment key={m.id}>
                                <span>
                                  {m.body.short_name}
                                  {' — od '}
                                  {m.since ? m.since : 'nevyplněno'}
                                  {' do '}
                                  {m.until ? m.until : 'nevyplněno'}
                                </span>
                                <br />
                              </React.Fragment>
                            ))}

                            {speaker.memberships.length === 0 &&
                              'Není členem žádné skupiny či strany'}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        </GetSpeakersQuery>
      </div>
    );
  }
}

export default connect()(Speakers);
