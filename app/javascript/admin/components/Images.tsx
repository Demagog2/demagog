import * as React from 'react';

import { Button, Classes, Dialog } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { GetContentImagesQuery, GetContentImagesQueryVariables } from '../operation-result-types';
import { DeleteContentImage } from '../queries/mutations';
import { GetContentImages } from '../queries/queries';
import { displayDateTime } from '../utils';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

class GetContentImagesQueryComponent extends Query<
  GetContentImagesQuery,
  GetContentImagesQueryVariables
> {}

interface IProps {
  dispatch: Dispatch;
}

interface IState {
  search: string;
  confirmDeleteModalId: string | null;
  zoomedId: string | null;
}

class Images extends React.Component<IProps, IState> {
  public state = {
    search: '',
    confirmDeleteModalId: null,
    zoomedId: null,
  };

  public onSearchChange = (search: string) => {
    this.setState({ search });
  };

  public showConfirmDeleteModal = (confirmDeleteModalId: string) => () => {
    this.setState({ confirmDeleteModalId });
  };

  public hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalId: null });
  };

  public onDeleted = () => {
    this.props.dispatch(addFlashMessage('Obrázek byl úspěšně smazán.', 'success'));

    this.hideConfirmDeleteModal();
  };

  public onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání obrázku', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public showZoomed = (id: string) => {
    this.setState({ zoomedId: id });
  };

  public hideZoomed = () => {
    this.setState({ zoomedId: null });
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['images:add']}>
          <div style={{ float: 'right' }}>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/images/new"
            >
              Přidat obrázek
            </Link>
          </div>
        </Authorize>

        <h2>Obrázky</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle názvu…"
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <GetContentImagesQueryComponent
            query={GetContentImages}
            variables={{ name: this.state.search }}
          >
            {({ data, loading, error }) => {
              if (loading || !data) {
                return <Loading />;
              }

              if (error) {
                console.error(error); // tslint:disable-line:no-console

                return null;
              }

              if (this.state.search !== '' && data.content_images.total_count === 0) {
                return <p>Nenašli jsme žádný obrázek s názvem „{this.state.search}‟.</p>;
              }

              const confirmDeleteModalContentImage = data.content_images.items.find(
                (s) => s.id === this.state.confirmDeleteModalId,
              );

              const zoomedContentImage = data.content_images.items.find(
                (s) => s.id === this.state.zoomedId,
              );

              return (
                <>
                  {confirmDeleteModalContentImage && (
                    <ConfirmDeleteModal
                      message={`Opravdu chcete smazat obrázek ${
                        confirmDeleteModalContentImage.name
                      }?`}
                      onCancel={this.hideConfirmDeleteModal}
                      mutation={DeleteContentImage}
                      mutationProps={{
                        variables: { id: this.state.confirmDeleteModalId },
                        refetchQueries: [
                          {
                            query: GetContentImages,
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

                  {zoomedContentImage && (
                    <Dialog
                      // className={this.props.data.themeName}
                      // icon="info-sign"
                      onClose={this.hideZoomed}
                      title={zoomedContentImage.name}
                      isOpen
                    >
                      <img
                        src={zoomedContentImage.image}
                        style={{
                          alignSelf: 'center',
                          marginTop: 20,
                          maxWidth: 460,
                          maxHeight: 460,
                        }}
                      />

                      <a
                        href={zoomedContentImage.image}
                        target="_blank"
                        style={{ alignSelf: 'center', marginTop: 20 }}
                      >
                        Veřejný odkaz
                      </a>
                    </Dialog>
                  )}

                  <p>
                    Zobrazuji
                    {data.content_images.total_count > data.content_images.items.length ? (
                      <>
                        {' '}
                        <strong>
                          prvních {Math.min(data.content_images.total_count, 20)} obrázků
                        </strong>{' '}
                        z <strong>celkových {data.content_images.total_count}</strong>
                      </>
                    ) : (
                      <>
                        {' '}
                        <strong>všech {data.content_images.total_count} obrázků</strong>
                      </>
                    )}
                    {this.state.search && <> vyhovujících hledání</>}
                  </p>

                  <table
                    className={classNames(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
                    style={{ width: '100%' }}
                  >
                    <thead>
                      <tr>
                        <th scope="col" />
                        <th scope="col" style={{ width: '50%' }}>
                          Název
                        </th>
                        <th scope="col">Přidaný</th>
                        <th scope="col">Autor</th>
                        <th scope="col" />
                        <Authorize permissions={['images:delete']}>
                          <th scope="col" />
                        </Authorize>
                      </tr>
                    </thead>
                    <tbody>
                      {data.content_images.items.map((contentImage) => (
                        <tr key={contentImage.id}>
                          <td>
                            <div
                              style={{
                                width: 50,
                                height: 50,
                                display: 'flex',
                                justifyContent: 'center',
                                cursor: 'zoom-in',
                              }}
                              onClick={() => this.showZoomed(contentImage.id)}
                            >
                              <img src={contentImage.image_50x50} style={{ alignSelf: 'center' }} />
                            </div>
                          </td>
                          <td style={{ wordBreak: 'break-word' }}>{contentImage.name}</td>
                          <td>{displayDateTime(contentImage.created_at)}</td>
                          <td>
                            {contentImage.user ? (
                              `${contentImage.user.first_name} ${contentImage.user.last_name}`
                            ) : (
                              <span className={Classes.TEXT_MUTED}>Chybí</span>
                            )}
                          </td>
                          <td>
                            <a href={contentImage.image} target="_blank">
                              Veřejný odkaz
                            </a>
                          </td>
                          <Authorize permissions={['images:delete']}>
                            <td>
                              <Button
                                type="button"
                                icon={IconNames.TRASH}
                                style={{ marginLeft: 7 }}
                                onClick={this.showConfirmDeleteModal(contentImage.id)}
                                title="Smazat"
                              />
                            </td>
                          </Authorize>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              );
            }}
          </GetContentImagesQueryComponent>
        </div>
      </div>
    );
  }
}

export default connect()(Images);
