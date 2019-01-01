import * as React from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  CreateMediaPersonalityMutation,
  CreateMediaPersonalityMutationVariables,
  MediaPersonalityInputType,
} from '../../operation-result-types';
import { CreateMediaPersonality } from '../../queries/mutations';
import { GET_MEDIA_PERSONALITIES } from '../forms/controls/MediaPersonalitySelect';
import { MediaPersonalityForm } from '../forms/MediaPersonalityForm';

class CreateMediaPersonalityMutationComponent extends Mutation<
  CreateMediaPersonalityMutation,
  CreateMediaPersonalityMutationVariables
> {}

type CreateMediaPersonalityMutationFn = MutationFn<
  CreateMediaPersonalityMutation,
  CreateMediaPersonalityMutationVariables
>;

interface ISourceNewProps extends RouteComponentProps<{}>, DispatchProp {}

export class MediaPersonalityNew extends React.Component<ISourceNewProps> {
  public onSuccess = (mediumId: string) => {
    this.props.dispatch(addFlashMessage('Moderátor byl úspěšně uložen.', 'success'));

    this.props.history.push(`/admin/media-personalities/edit/${mediumId}`);
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání moderátora.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (createMediaPersonality: CreateMediaPersonalityMutationFn) => (
    mediaPersonalityInput: MediaPersonalityInputType,
  ) => {
    return createMediaPersonality({ variables: { mediaPersonalityInput } })
      .then((mutationResult) => {
        if (
          !mutationResult ||
          !mutationResult.data ||
          !mutationResult.data.createMediaPersonality
        ) {
          return;
        }

        const mediumId = mutationResult.data.createMediaPersonality.id;

        this.onSuccess(mediumId);
      })
      .catch((error) => this.onError(error));
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <CreateMediaPersonalityMutationComponent
          mutation={CreateMediaPersonality}
          // TODO: is there a nicer way of updating apollo cache after creating?
          refetchQueries={[{ query: GET_MEDIA_PERSONALITIES }]}
        >
          {(createMedium) => {
            return (
              <MediaPersonalityForm
                onSubmit={this.onSubmit(createMedium)}
                title="Přidat nové moderátory"
              />
            );
          }}
        </CreateMediaPersonalityMutationComponent>
      </div>
    );
  }
}

export default connect()(withRouter(MediaPersonalityNew));
