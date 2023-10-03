import * as React from 'react';

import { Button, Card, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import type { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import type { DispatchProp } from 'react-redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import type {
  GetSpeakers as GetSpeakersQuery,
  GetSpeakersVariables as GetSpeakersQueryVariables,
} from '../operation-result-types';
import { DeleteSpeaker } from '../queries/mutations';
import { GetSpeakers } from '../queries/queries';
import { displayDate } from '../utils';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import SpeakerAvatar from './SpeakerAvatar';

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

  private readonly onSearchChange = (search: string) => {
    this.setState({ search });
  };

  private readonly showConfirmDeleteModal = (confirmDeleteModalSpeakerId: string) => () => {
    this.setState({ confirmDeleteModalSpeakerId });
  };

  private readonly hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalSpeakerId: null });
  };

  private readonly onDeleted = () => {
    this.props.dispatch(addFlashMessage('Osoba byla úspěšně smazána.', 'success'));
    this.hideConfirmDeleteModal();
  };

  private readonly onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání osoby', 'error'));

    console.error(error);
  };

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

        <Query<GetSpeakersQuery, GetSpeakersQueryVariables>
          query={GetSpeakers}
          variables={{ name: this.state.search, limit: SPEAKERS_PER_PAGE, offset: 0 }}
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

            const deletedSpeaker = props.data.speakers.find(
              (s) => s.id === confirmDeleteModalSpeakerId,
            );

            return (
              <div style={{ marginTop: 15 }}>
                {deletedSpeaker && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat osobu ${deletedSpeaker.firstName} ${deletedSpeaker.lastName}?`}
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
                          first_name={speaker.firstName}
                          last_name={speaker.lastName}
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
                          {speaker.firstName} {speaker.lastName}
                        </h5>

                        <ul className={Classes.LIST_UNSTYLED}>
                          <li>
                            <span className={Classes.TEXT_MUTED}>Wikidata ID: </span>
                            <p>
                              {speaker.wikidataId
                                ? (
                                <a
                                  href={`https://www.wikidata.org/wiki/${speaker.wikidataId}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {speaker.wikidataId}
                                </a>
                                  )
                                : (
                                    '–'
                                  )}
                            </p>
                          </li>
                          <li>
                            <span className={Classes.TEXT_MUTED}>Hlídač státu OsobaID: </span>
                            <p>
                              {speaker.osobaId
                                ? (
                                <a
                                  href={`https://www.hlidacstatu.cz/osoba/${speaker.osobaId}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {speaker.osobaId}
                                </a>
                                  )
                                : (
                                    '–'
                                  )}
                            </p>
                          </li>
                          <li>
                            <span className={Classes.TEXT_MUTED}>Respektovaný odkaz: </span>
                            <p>
                              {speaker.websiteUrl
                                ? (
                                <a href={speaker.websiteUrl} target="_blank" rel="noreferrer">
                                  {speaker.websiteUrl}
                                </a>
                                  )
                                : (
                                    '–'
                                  )}
                            </p>
                          </li>
                          <li>
                            <span className={Classes.TEXT_MUTED}>
                              Příslušnost ke skupinám/stranám:{' '}
                            </span>
                            <p>
                              {(speaker.memberships || []).map((m) => (
                                <React.Fragment key={m.id}>
                                  <span>
                                    {m.body.shortName}
                                    {' — od '}
                                    {m.since ? displayDate(m.since) : 'nevyplněno'}
                                    {' do '}
                                    {m.until ? displayDate(m.until) : 'nevyplněno'}
                                  </span>
                                  <br />
                                </React.Fragment>
                              ))}

                              {(speaker.memberships || []).length === 0 &&
                                'Není členem žádné skupiny či strany'}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}

                {props.data.speakers.length > 0 && (
                  <Button
                    onClick={async() =>
                      await props.fetchMore({
                        variables: {
                          offset: props.data ? props.data.speakers.length : 0,
                        },

                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) {
                            return prev;
                          }

                          return {
                            ...prev,
                            speakers: [...prev.speakers, ...fetchMoreResult.speakers],
                          };
                        },
                      })
                    }
                    text="Načíst další"
                  />
                )}

                {props.data.speakers.length === 0 && this.state.search !== '' && (
                  <p>Nenašli jsme žádnou osobu se jménem „{this.state.search}“.</p>
                )}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

const SPEAKERS_PER_PAGE = 50;

export default connect()(Speakers);
