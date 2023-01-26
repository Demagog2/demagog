import * as React from 'react';

import { Mutation, Query } from '@apollo/client/react/components';
import { MutationFunction } from '@apollo/client';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetPage as GetPageQuery,
  GetPageVariables as GetPageQueryVariables,
  PageInput,
  UpdatePage as UpdatePageMutation,
  UpdatePageVariables as UpdatePageMutationVariables,
} from '../../operation-result-types';
import { UpdatePage } from '../../queries/mutations';
import { GetPage, GetPages } from '../../queries/queries';
import { PageForm } from '../forms/PageForm';
import Loading from '../Loading';

type UpdatePageMutationFn = MutationFunction<UpdatePageMutation, UpdatePageMutationVariables>;

interface IPageEditProps extends RouteComponentProps<{ id: string }>, DispatchProp {}

class PageEdit extends React.Component<IPageEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Stránka byla úspěšně uložena.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání stránky.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updatePage: UpdatePageMutationFn) => (pageInput: PageInput) => {
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
        <Query<GetPageQuery, GetPageQueryVariables> query={GetPage} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <Mutation<UpdatePageMutation, UpdatePageMutationVariables>
                mutation={UpdatePage}
                refetchQueries={[
                  { query: GetPages, variables: { name: null } },
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
              </Mutation>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default connect()(PageEdit);
