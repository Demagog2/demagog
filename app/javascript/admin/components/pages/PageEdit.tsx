import * as React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetPageQuery,
  GetPageQueryVariables,
  PageInputType,
  UpdatePageMutation,
  UpdatePageMutationVariables,
} from '../../operation-result-types';
import { UpdatePage } from '../../queries/mutations';
import { GetPage, GetPages } from '../../queries/queries';
import { PageForm } from '../forms/PageForm';
import Loading from '../Loading';

class PageQuery extends Query<GetPageQuery, GetPageQueryVariables> {}
class UpdatePageMutationComponent extends Mutation<
  UpdatePageMutation,
  UpdatePageMutationVariables
> {}

type UpdatePageMutationFn = MutationFn<UpdatePageMutation, UpdatePageMutationVariables>;

interface IPageEditProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
}

class PageEdit extends React.Component<IPageEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Stránka byla úspěšně uložena.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání stránky.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updatePage: UpdatePageMutationFn) => (pageInput: PageInputType) => {
    const id = this.getParamId();

    return updatePage({ variables: { id, pageInput } })
      .then(() => this.onSuccess())
      .catch((error) => this.onError(error));
  };

  public getParamId = () => this.props.match.params.id;

  public render() {
    const id = this.getParamId();

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <PageQuery query={GetPage} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <UpdatePageMutationComponent
                mutation={UpdatePage}
                refetchQueries={[
                  { query: GetPages, variables: { name: null, offset: 0, limit: 15 } },
                  { query: GetPage, variables: { id } },
                ]}
              >
                {(updatePage) => {
                  return (
                    <PageForm
                      page={data.page}
                      onSubmit={this.onSubmit(updatePage)}
                      title="Upravit stránku"
                      backPath="/admin/pages"
                    />
                  );
                }}
              </UpdatePageMutationComponent>
            );
          }}
        </PageQuery>
      </div>
    );
  }
}

export default connect()(PageEdit);
