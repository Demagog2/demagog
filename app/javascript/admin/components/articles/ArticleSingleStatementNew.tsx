import * as React from 'react';

import { Formik } from 'formik';
import { Mutation, MutationFunction } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import { uploadArticleIllustration } from '../../api';
import {
  ArticleInput,
  CreateArticle as CreateArticleMutation,
  CreateArticleVariables as CreateArticleMutationVariables,
} from '../../operation-result-types';
import { CreateArticle } from '../../queries/mutations';
import { GetArticles } from '../../queries/queries';
import { ArticleSingleStatementForm } from './ArticleSingleStatementForm';

type CreateArticleMutationFn = MutationFunction<
  CreateArticleMutation,
  CreateArticleMutationVariables
>;

interface ISourceNewProps extends RouteComponentProps<{}>, DispatchProp {}

export class ArticleSingleStatementNew extends React.Component<ISourceNewProps> {
  public onSuccess = (articleId: string) => {
    this.props.dispatch(addFlashMessage('Článek byl úspěšně uložen.', 'success'));

    this.props.history.push(`/admin/articles/edit-single-statement/${articleId}`);
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání článku', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (createArticle: CreateArticleMutationFn) => (
    articleFormData: ArticleInput & { illustration?: File },
  ) => {
    const { illustration, ...articleInput } = articleFormData;

    return createArticle({ variables: { articleInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data || !mutationResult.data.createArticle) {
          return;
        }

        const articleId = mutationResult.data.createArticle.article.id;

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
        <Mutation<CreateArticleMutation, CreateArticleMutationVariables>
          mutation={CreateArticle}
          // TODO: is there a nicer way of updating apollo cache after creating?
          refetchQueries={[{ query: GetArticles, variables: { title: '', offset: 0, limit: 50 } }]}
        >
          {(createArticle) => {
            return (
              <ArticleSingleStatementForm
                onSubmit={this.onSubmit(createArticle)}
                title="Přidat jednotlivý výrok jako článek"
                backPath="/admin/articles"
              />
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default connect()(withRouter(ArticleSingleStatementNew));
