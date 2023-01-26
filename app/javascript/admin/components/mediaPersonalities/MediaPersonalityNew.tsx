import * as React from 'react';

import { MutationFunction } from '@apollo/client';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  CreateMediaPersonality as CreateMediaPersonalityMutation,
  CreateMediaPersonalityVariables as CreateMediaPersonalityMutationVariables,
  MediaPersonalityInput,
} from '../../operation-result-types';
import { CreateMediaPersonality } from '../../queries/mutations';
import { GetMediaPersonalitiesForSelect } from '../../queries/queries';
import { MediaPersonalityForm } from '../forms/MediaPersonalityForm';
import { Mutation } from '@apollo/client/react/components';

type CreateMediaPersonalityMutationFn = MutationFunction<
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
    mediaPersonalityInput: MediaPersonalityInput,
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

        const mediumId = mutationResult.data.createMediaPersonality.mediaPersonality.id;

        this.onSuccess(mediumId);
      })
      .catch((error) => this.onError(error));
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Mutation<CreateMediaPersonalityMutation, CreateMediaPersonalityMutationVariables>
          mutation={CreateMediaPersonality}
          // TODO: is there a nicer way of updating apollo cache after creating?
          refetchQueries={[{ query: GetMediaPersonalitiesForSelect }]}
        >
          {(createMedium) => {
            return (
              <MediaPersonalityForm
                onSubmit={this.onSubmit(createMedium)}
                title="Přidat nové moderátory"
              />
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default connect()(withRouter(MediaPersonalityNew));
