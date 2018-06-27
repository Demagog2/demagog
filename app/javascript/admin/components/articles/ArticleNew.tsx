import * as React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import {
  ArticleInputType,
  CreateArticleMutation,
  CreateArticleMutationVariables,
} from '../../operation-result-types';
import { CreateArticle } from '../../queries/mutations';
import { ArticleForm } from '../forms/ArticleForm';

class CreateArticleMutationComponent extends Mutation<
  CreateArticleMutation,
  CreateArticleMutationVariables
> {}

type CreateArticleMutationFn = MutationFn<CreateArticleMutation, CreateArticleMutationVariables>;

interface ISourceNewProps extends RouteComponentProps<{}> {
  addFlashMessage: (msg: string) => void;
}

interface ISourceNewState {
  submitting: boolean;
}

export class ArticleNew extends React.Component<ISourceNewProps, ISourceNewState> {
  public state: ISourceNewState = {
    submitting: false,
  };

  public onSuccess = (source: CreateArticleMutation) => {
    this.props.addFlashMessage('Článek byl úspěšně uložen.');

    if (source.createArticle) {
      this.props.history.push(`/admin/articles/edit/${source.createArticle.id}`);
    }
  };

  public onError = (error) => {
    this.props.addFlashMessage('Došlo k chybě při ukládání článku');
    // tslint:disable-next-line:no-console
    console.error(error);

    this.setState({ submitting: false });
  };

  public onSubmit = (createArticle: CreateArticleMutationFn) => (
    articleInput: ArticleInputType,
  ) => {
    this.setState({ submitting: true });

    createArticle({ variables: { articleInput } });
  };

  public render() {
    return (
      <div role="main">
        <CreateArticleMutationComponent
          mutation={CreateArticle}
          onCompleted={this.onSuccess}
          onError={this.onError}
        >
          {(createArticle) => {
            return (
              <ArticleForm
                onSubmit={this.onSubmit(createArticle)}
                submitting={this.state.submitting}
                title="Přidat nový článek"
                backPath="/admin/articles"
              />
            );
          }}
        </CreateArticleMutationComponent>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addFlashMessage(message: string) {
      dispatch(addFlashMessage(message));
    },
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(withRouter(ArticleNew));
