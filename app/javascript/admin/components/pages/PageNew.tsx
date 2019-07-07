import * as React from 'react';

import { Mutation } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  CreatePage as CreatePageMutation,
  CreatePageVariables as CreatePageMutationVariables,
} from '../../operation-result-types';
import { CreatePage } from '../../queries/mutations';
import { GetPages } from '../../queries/queries';
import { PageForm } from '../forms/PageForm';

class CreatePageMutationComponent extends Mutation<
  CreatePageMutation,
  CreatePageMutationVariables
> {}

interface IPageNewProps extends RouteComponentProps<{}>, DispatchProp {}

export class PageNew extends React.Component<IPageNewProps> {
  public onSuccess = (pageId: string) => {
    this.props.dispatch(addFlashMessage('stránka byl úspěšně uložena.', 'success'));

    this.props.history.push(`/admin/pages/edit/${pageId}`);
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání stránky.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <CreatePageMutationComponent
          mutation={CreatePage}
          // TODO: is there a nicer way of updating apollo cache after creating?
          refetchQueries={[{ query: GetPages, variables: { title: '', offset: 0, limit: 50 } }]}
          onCompleted={(data) => data.createPage && this.onSuccess(data.createPage.page.id)}
          onError={this.onError}
        >
          {(createPage) => {
            return (
              <PageForm
                onSubmit={(pageInput) => createPage({ variables: { pageInput } })}
                title="Přidat novou stránku"
                backPath="/admin/pages"
              />
            );
          }}
        </CreatePageMutationComponent>
      </div>
    );
  }
}

export default connect()(withRouter(PageNew));
