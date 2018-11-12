import * as React from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import { uploadArticleIllustration } from '../../api';
import {
  ArticleInputType,
  CreateArticleMutation,
  CreateArticleMutationVariables,
} from '../../operation-result-types';
import { CreateArticle } from '../../queries/mutations';
import { GetArticles } from '../../queries/queries';
import { ArticleForm } from '../forms/ArticleForm';

class CreateArticleMutationComponent extends Mutation<
  CreateArticleMutation,
  CreateArticleMutationVariables
> {}

type CreateArticleMutationFn = MutationFn<CreateArticleMutation, CreateArticleMutationVariables>;

interface ISourceNewProps extends RouteComponentProps<{}>, DispatchProp {}

export class ArticleNew extends React.Component<ISourceNewProps> {
  public onSuccess = (articleId: string) => {
    this.props.dispatch(addFlashMessage('Článek byl úspěšně uložen.', 'success'));

    this.props.history.push(`/admin/articles/edit/${articleId}`);
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání článku', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (createArticle: CreateArticleMutationFn) => (
    articleFormData: ArticleInputType & { illustration?: File },
  ) => {
    const { illustration, ...articleInput } = articleFormData;

    return createArticle({ variables: { articleInput } })
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
      <div style={{ padding: '15px 0 40px 0' }}>
        <CreateArticleMutationComponent
          mutation={CreateArticle}
          // TODO: is there a nicer way of updating apollo cache after creating?
          refetchQueries={[{ query: GetArticles, variables: { title: '', offset: 0, limit: 50 } }]}
        >
          {(createArticle) => {
            return (
              <ArticleForm
                onSubmit={this.onSubmit(createArticle)}
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

export default connect()(withRouter(ArticleNew));
