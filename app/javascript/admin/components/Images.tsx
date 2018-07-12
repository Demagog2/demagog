import * as React from 'react';

import { AnchorButton, Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Mutation, MutationFn, Query } from 'react-apollo';
import Dropzone, { ImageFile } from 'react-dropzone';
import { connect, Dispatch } from 'react-redux';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadContentImage } from '../api';
import apolloClient from '../apolloClient';
import {
  CreateContentImageMutation,
  CreateContentImageMutationVariables,
  GetContentImagesQuery,
  GetContentImagesQueryVariables,
} from '../operation-result-types';
import { CreateContentImage, DeleteContentImage } from '../queries/mutations';
import { GetContentImages } from '../queries/queries';
import { IState as ReduxState } from '../reducers';
import { displayDateTime } from '../utils';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

class GetContentImagesQueryComponent extends Query<
  GetContentImagesQuery,
  GetContentImagesQueryVariables
> {}

class CreateContentImageMutationComponent extends Mutation<
  CreateContentImageMutation,
  CreateContentImageMutationVariables
> {}

interface ICreateContentImageFn
  extends MutationFn<CreateContentImageMutation, CreateContentImageMutationVariables> {}

interface IProps {
  currentUser: ReduxState['currentUser']['user'];
  dispatch: Dispatch;
}

interface IState {
  search: string;
  confirmDeleteModalId: string | null;
  zoomedId: string | null;
  isAdding: boolean;
  isLoadingMore: boolean;
}

class Images extends React.Component<IProps, IState> {
  public state = {
    search: '',
    confirmDeleteModalId: null,
    zoomedId: null,
    isAdding: false,
    isLoadingMore: false,
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

  public onAddDrop = (createContentImage: ICreateContentImageFn) => (
    acceptedFiles: ImageFile[],
  ) => {
    if (acceptedFiles.length === 1 && this.props.currentUser) {
      const imageFile = acceptedFiles[0];
      const input = {
        user_id: this.props.currentUser.id,
      };

      this.setState({ isAdding: true });

      createContentImage({ variables: { input } })
        .then(
          (mutationResult): Promise<any> | undefined => {
            if (
              !mutationResult ||
              !mutationResult.data ||
              !mutationResult.data.createContentImage
            ) {
              return;
            }

            const contentImageId = parseInt(mutationResult.data.createContentImage.id, 10);

            return uploadContentImage(contentImageId, imageFile);
          },
        )
        .then(() => {
          // Refetch content images AFTER the upload so we get the filename and path
          return apolloClient.query({
            query: GetContentImages,
            variables: { name: '' },
            fetchPolicy: 'network-only',
          });
        })
        .then(() => {
          this.props.dispatch(addFlashMessage('Obrázek byl úspěšně nahrán.', 'success'));

          this.setState({ search: '', isAdding: false });
        })
        .catch((error) => {
          this.props.dispatch(addFlashMessage('Při nahrávání obrázku došlo k chybě.', 'error'));

          this.setState({ isAdding: false });

          console.error(error); // tslint:disable-line:no-console
        });
    }
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['images:add']}>
          <div style={{ float: 'right' }}>
            <CreateContentImageMutationComponent mutation={CreateContentImage}>
              {(createContentImage) => (
                <Dropzone
                  accept="image/jpeg, image/png, image/gif"
                  multiple={false}
                  onDrop={this.onAddDrop(createContentImage)}
                  className="dropzone"
                  style={{}}
                >
                  <Button
                    type="button"
                    icon={IconNames.UPLOAD}
                    intent={Intent.PRIMARY}
                    disabled={this.state.isAdding}
                    text={this.state.isAdding ? 'Nahrávám…' : 'Nahrát obrázek'}
                  />
                </Dropzone>
              )}
            </CreateContentImageMutationComponent>
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
            variables={{ name: this.state.search, offset: 0, limit: 20 }}
          >
            {({ data, loading, error, fetchMore }) => {
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
                    <Dialog onClose={this.hideZoomed} title={zoomedContentImage.name} isOpen>
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
                          posledních{' '}
                          {Math.min(
                            data.content_images.total_count,
                            data.content_images.items.length,
                          )}{' '}
                          obrázků
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
                        <th scope="col" />
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
                          <td>
                            <AnchorButton
                              href={contentImage.image}
                              download
                              icon={IconNames.DOWNLOAD}
                              title="Stáhnout"
                            />
                            <Authorize permissions={['images:delete']}>
                              <Button
                                type="button"
                                icon={IconNames.TRASH}
                                style={{ marginLeft: 7 }}
                                onClick={this.showConfirmDeleteModal(contentImage.id)}
                                title="Smazat"
                              />
                            </Authorize>
                          </td>
                        </tr>
                      ))}
                      {data.content_images.total_count > data.content_images.items.length && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center' }}>
                            <Button
                              type="button"
                              text={this.state.isLoadingMore ? 'Nahrávám…' : 'Zobrazit další…'}
                              disabled={this.state.isLoadingMore}
                              large
                              minimal
                              onClick={() => {
                                this.setState({ isLoadingMore: true });

                                fetchMore({
                                  variables: {
                                    offset: data.content_images.items.length,
                                  },
                                  updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) {
                                      return prev;
                                    }

                                    return {
                                      content_images: {
                                        ...prev.content_images,
                                        items: [
                                          ...prev.content_images.items,
                                          ...fetchMoreResult.content_images.items,
                                        ],
                                      },
                                    };
                                  },
                                }).finally(() => {
                                  this.setState({ isLoadingMore: false });
                                });
                              }}
                            />
                          </td>
                        </tr>
                      )}
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

const mapStateToProps = (state: ReduxState) => ({
  currentUser: state.currentUser.user,
});

export default connect(mapStateToProps)(Images);
