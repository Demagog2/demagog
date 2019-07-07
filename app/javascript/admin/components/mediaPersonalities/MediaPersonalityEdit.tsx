import * as React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetMediaPersonality as GetMediaPersonalityQuery,
  GetMediaPersonalityVariables as GetMediaPersonalityQueryVariables,
  MediaPersonalityInput,
  UpdateMediaPersonality as UpdateMediaPersonalityMutation,
  UpdateMediaPersonalityVariables as UpdateMediaPersonalityMutationVariables,
} from '../../operation-result-types';
import { UpdateMediaPersonality } from '../../queries/mutations';
import {
  GetMediaPersonalities,
  GetMediaPersonalitiesForSelect,
  GetMediaPersonality,
} from '../../queries/queries';
import { MediaPersonalityForm } from '../forms/MediaPersonalityForm';
import Loading from '../Loading';

class UpdateMediaPersonalityMutationComponent extends Mutation<
  UpdateMediaPersonalityMutation,
  UpdateMediaPersonalityMutationVariables
> {}

type UpdateMediaPersonalityMutationFn = MutationFn<
  UpdateMediaPersonalityMutation,
  UpdateMediaPersonalityMutationVariables
>;

interface IMediaPersonalityEditProps extends RouteComponentProps<{ id: string }>, DispatchProp {}

class MediaPersonalityEdit extends React.Component<IMediaPersonalityEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Moderátor byl úspěšně uložen.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání moderátora.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateMediaPersonality: UpdateMediaPersonalityMutationFn) => (
    mediaPersonalityInput: MediaPersonalityInput,
  ) => {
    const id = this.getParamId();

    return updateMediaPersonality({ variables: { id, mediaPersonalityInput } })
      .then(() => this.onSuccess())
      .catch((error) => this.onError(error));
  };

  public getParamId = () => this.props.match.params.id;

  public render() {
    const id = this.getParamId();

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Query<GetMediaPersonalityQuery, GetMediaPersonalityQueryVariables>
          query={GetMediaPersonality}
          variables={{ id }}
        >
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <UpdateMediaPersonalityMutationComponent
                mutation={UpdateMediaPersonality}
                refetchQueries={[
                  { query: GetMediaPersonalities, variables: { name: '' } },
                  { query: GetMediaPersonality, variables: { id } },
                  { query: GetMediaPersonalitiesForSelect },
                ]}
              >
                {(updateMediaPersonality) => {
                  return (
                    <MediaPersonalityForm
                      mediaPersonality={data.mediaPersonality}
                      onSubmit={this.onSubmit(updateMediaPersonality)}
                      title="Upravit moderátory"
                    />
                  );
                }}
              </UpdateMediaPersonalityMutationComponent>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default connect()(MediaPersonalityEdit);
