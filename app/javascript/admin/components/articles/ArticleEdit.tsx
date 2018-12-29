import * as React from 'react';

import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import { deleteArticleIllustration, uploadArticleIllustration } from '../../api';
import {
  ArticleInputType,
  GetArticleQuery,
  GetArticleQueryVariables,
  UpdateArticleMutation,
  UpdateArticleMutationVariables,
} from '../../operation-result-types';
import { UpdateArticle } from '../../queries/mutations';
import { GetArticle, GetArticles } from '../../queries/queries';
import Loading from '../Loading';
import { ArticleForm } from './ArticleForm';

class ArticleQuery extends Query<GetArticleQuery, GetArticleQueryVariables> {}
class UpdateArticleMutationComponent extends Mutation<
  UpdateArticleMutation,
  UpdateArticleMutationVariables
> {}

type UpdateArticleMutationFn = MutationFn<UpdateArticleMutation, UpdateArticleMutationVariables>;

interface IArticleEditProps extends RouteComponentProps<{ id: string }>, DispatchProp {}

class ArticleEdit extends React.Component<IArticleEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Článek byl úspěšně uložen.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání článku', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateArticle: UpdateArticleMutationFn, oldArticle: GetArticleQuery) => (
    articleFormData: ArticleInputType & { illustration: File },
  ) => {
    const { illustration, ...articleInput } = articleFormData;

    const id = this.getParamId();

    let imageUpload: Promise<any> = Promise.resolve();
    if (illustration instanceof File) {
      imageUpload = uploadArticleIllustration(id, illustration);
    } else if (illustration === null && oldArticle.article.illustration !== null) {
      imageUpload = deleteArticleIllustration(id);
    }

    return imageUpload
      .then(() => updateArticle({ variables: { id, articleInput } }))
      .then(() => this.onSuccess())
      .catch((error) => this.onError(error));
  };

  public getParamId = () => this.props.match.params.id;

  public render() {
    const id = this.getParamId();

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <ArticleQuery query={GetArticle} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <UpdateArticleMutationComponent
                mutation={UpdateArticle}
                refetchQueries={[
                  { query: GetArticles, variables: { name: null } },
                  { query: GetArticle, variables: { id } },
                ]}
              >
                {(updateArticle) => {
                  return (
                    <ArticleForm
                      article={data.article}
                      onSubmit={this.onSubmit(updateArticle, data)}
                      title="Upravit článek"
                      backPath="/admin/articles"
                    />
                  );
                }}
              </UpdateArticleMutationComponent>
            );
          }}
        </ArticleQuery>
      </div>
    );
  }
}

export default connect()(ArticleEdit);
