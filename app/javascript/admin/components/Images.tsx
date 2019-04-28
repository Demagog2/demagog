import * as React from 'react';

import { AnchorButton, Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import * as copy from 'copy-to-clipboard';
import { Query } from 'react-apollo';
import Dropzone, { ImageFile } from 'react-dropzone';
import { connect, DispatchProp } from 'react-redux';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadContentImage } from '../api';
import apolloClient from '../apolloClient';
import { GetContentImagesQuery, GetContentImagesQueryVariables } from '../operation-result-types';
import { DeleteContentImage } from '../queries/mutations';
import { GetContentImages } from '../queries/queries';
import { displayDateTime } from '../utils';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

const IMAGES_PER_PAGE = 20;

class GetContentImagesQueryComponent extends Query<
  GetContentImagesQuery,
  GetContentImagesQueryVariables
> {}

interface IProps extends DispatchProp<any> {}

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

  public onAddDrop = (acceptedFiles: ImageFile[]) => {
    if (acceptedFiles.length === 1) {
      const imageFile = acceptedFiles[0];

      this.setState({ isAdding: true });

      uploadContentImage(imageFile)
        .then(() =>
          apolloClient.query({
            query: GetContentImages,
            variables: { name: '', offset: 0, limit: IMAGES_PER_PAGE },
            fetchPolicy: 'network-only',
          }),
        )
        .then(() => {
          this.props.dispatch(addFlashMessage('Obrázek byl úspěšně nahrán.', 'success'));

          this.setState({ search: '', isAdding: false });
        })
        .catch((error: Response) => {
          // HTTP code 413 is Request Entity Too Large, server returns it when uploaded
          // image is too big
          if (error.status === 413) {
            this.props.dispatch(
              addFlashMessage(
                'Obrázek je větší než teď povolujeme, zmenšete ho a nahrajte znovu.',
                'warning',
              ),
            );
          } else {
            this.props.dispatch(addFlashMessage('Při nahrávání obrázku došlo k chybě.', 'error'));
          }

          this.setState({ isAdding: false });

          console.error(error); // tslint:disable-line:no-console
        });
    }
  };

  public copyImageUrlToClipboard = (
    contentImage: GetContentImagesQuery['contentImages']['items'][0],
  ) => () => {
    const baseUrl = document.location
      ? `${document.location.protocol}//${document.location.host}`
      : '';
    const url = `${baseUrl}${contentImage.image}`;

    copy(url);

    this.props.dispatch(
      addFlashMessage(
        `Odkaz na obrázek ${contentImage.name} úspěšně zkopírován do schránky.`,
        'success',
      ),
    );
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['images:add']}>
          <div style={{ float: 'right' }}>
            <Dropzone
              accept="image/jpeg, image/png, image/gif"
              multiple={false}
              onDrop={this.onAddDrop}
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
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Obrázky</h2>

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
            variables={{ name: this.state.search, offset: 0, limit: IMAGES_PER_PAGE }}
          >
            {({ data, loading, error, fetchMore }) => {
              if (loading || !data) {
                return <Loading />;
              }

              if (error) {
                console.error(error); // tslint:disable-line:no-console

                return null;
              }

              if (this.state.search !== '' && data.contentImages.totalCount === 0) {
                return <p>Nenašli jsme žádný obrázek s názvem „{this.state.search}‟.</p>;
              }

              const confirmDeleteModalContentImage = data.contentImages.items.find(
                (s) => s.id === this.state.confirmDeleteModalId,
              );

              const zoomedContentImage = data.contentImages.items.find(
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
                              offset: 0,
                              limit: IMAGES_PER_PAGE,
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
                    {data.contentImages.totalCount > data.contentImages.items.length ? (
                      <>
                        {' '}
                        <strong>
                          posledních{' '}
                          {Math.min(data.contentImages.totalCount, data.contentImages.items.length)}{' '}
                          obrázků
                        </strong>{' '}
                        z <strong>celkových {data.contentImages.totalCount}</strong>
                      </>
                    ) : (
                      <>
                        {' '}
                        <strong>všech {data.contentImages.totalCount} obrázků</strong>
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
                      {data.contentImages.items.map((contentImage) => (
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
                              <img src={contentImage.image50x50} style={{ alignSelf: 'center' }} />
                            </div>
                          </td>
                          <td style={{ wordBreak: 'break-word' }}>{contentImage.name}</td>
                          <td>{displayDateTime(contentImage.createdAt)}</td>
                          <td>
                            {contentImage.user ? (
                              `${contentImage.user.firstName} ${contentImage.user.lastName}`
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
                            <Button
                              type="button"
                              icon={IconNames.CLIPBOARD}
                              style={{ marginLeft: 7 }}
                              onClick={this.copyImageUrlToClipboard(contentImage)}
                              text="Kopírovat odkaz"
                            />
                            <AnchorButton
                              href={contentImage.image}
                              download
                              icon={IconNames.DOWNLOAD}
                              style={{ marginLeft: 7 }}
                              text="Stáhnout"
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
                      {data.contentImages.totalCount > data.contentImages.items.length && (
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
                                    offset: data.contentImages.items.length,
                                  },
                                  updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) {
                                      return prev;
                                    }

                                    return {
                                      contentImages: {
                                        ...prev.contentImages,
                                        items: [
                                          ...prev.contentImages.items,
                                          ...fetchMoreResult.contentImages.items,
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

export default connect()(Images);
