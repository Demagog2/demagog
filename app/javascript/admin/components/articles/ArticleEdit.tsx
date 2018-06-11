import * as React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import {
  ArticleInputType,
  GetArticleQuery,
  GetArticleQueryVariables,
  UpdateArticleMutation,
  UpdateArticleMutationVariables,
} from '../../operation-result-types';
import { UpdateArticle } from '../../queries/mutations';
import { GetArticle } from '../../queries/queries';
import { ArticleForm } from '../forms/ArticleForm';

class ArticleQuery extends Query<GetArticleQuery, GetArticleQueryVariables> {}
class UpdateArticleMutationComponent extends Mutation<
  UpdateArticleMutation,
  UpdateArticleMutationVariables
> {}

type UpdateArticleMutationFn = MutationFn<UpdateArticleMutation, UpdateArticleMutationVariables>;

interface IArticleEditProps extends RouteComponentProps<{ id: string }> {
  addFlashMessage: (message: string) => void;
}

interface IArticleEditState {
  submitting: boolean;
}

class ArticleEdit extends React.Component<IArticleEditProps, IArticleEditState> {
  public state: IArticleEditState = {
    submitting: false,
  };

  public onSuccess = () => {
    this.props.addFlashMessage('Článek byl úspěšně uložen.');
  };

  public onError = (error) => {
    this.props.addFlashMessage('Došlo k chybě při ukládání článku');
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateArticle: UpdateArticleMutationFn) => (
    articleInput: ArticleInputType,
  ) => {
    const id = this.getParamId();

    this.setState({ submitting: true });

    updateArticle({ variables: { id, articleInput } }).finally(() => {
      this.setState({ submitting: false });
    });
  };

  public getParamId = () => this.props.match.params.id;

  public render() {
    const id = this.getParamId();

    return (
      <div role="main">
        <h1>Upravit článek</h1>

        <ArticleQuery query={GetArticle} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return 'Loading...';
            }

            if (!data) {
              return null;
            }

            return (
              <UpdateArticleMutationComponent
                mutation={UpdateArticle}
                onCompleted={this.onSuccess}
                onError={this.onError}
              >
                {(updateArticle) => {
                  return (
                    <ArticleForm
                      articleQuery={data}
                      onSubmit={this.onSubmit(updateArticle)}
                      submitting={this.state.submitting}
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
)(ArticleEdit);
