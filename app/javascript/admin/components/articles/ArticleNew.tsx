import * as React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import { uploadArticleIllustration } from '../../api';
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

  public onSuccess = (articleId: string) => {
    this.props.addFlashMessage('Článek byl úspěšně uložen.');

    this.props.history.push(`/admin/articles/edit/${articleId}`);
  };

  public onError = (error) => {
    this.props.addFlashMessage('Došlo k chybě při ukládání článku');
    // tslint:disable-next-line:no-console
    console.error(error);

    this.setState({ submitting: false });
  };

  public onSubmit = (createArticle: CreateArticleMutationFn) => (
    articleFormData: ArticleInputType & { illustration?: File },
  ) => {
    const { illustration, ...articleInput } = articleFormData;

    this.setState({ submitting: true });

    createArticle({ variables: { articleInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data || !mutationResult.data.createArticle) {
          return;
        }

        const articleId = mutationResult.data.createArticle.id;

        let uploadPromise: Promise<any> = Promise.resolve();

        if (illustration instanceof File) {
          uploadPromise = uploadArticleIllustration(articleId, illustration);
        }

        return uploadPromise.then(() => this.onSuccess(articleId));
      })
      .catch((error) => this.onError(error));
  };

  public render() {
    return (
      <div role="main">
        <CreateArticleMutationComponent mutation={CreateArticle}>
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
