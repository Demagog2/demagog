/* eslint camelcase: 0 */

import * as React from 'react';
import { Link } from 'react-router-dom';

import { EditableText, Switch } from '@blueprintjs/core';
import { ArticleInputType, GetArticleQuery } from '../../operation-result-types';
import ArticleIllustration from '../ArticleIllustration';
import DateInput from './controls/DateInput';
import ImageInput from './controls/ImageInput';
// import { CheckboxInput } from './controls/CheckboxInput';
// import { Input } from './controls/Input';
import { SegmentManager } from './controls/SegmentManager';
// import { TextInput } from './controls/TextInput';
import { Form } from './Form';

interface IArticleFormProps {
  articleQuery?: GetArticleQuery;
  onSubmit: (formData: ArticleInputType) => void;
  submitting: boolean;
  title: string;
  backPath: string;
}

class ArticleInternalForm extends Form<ArticleInputType> {}

function mapQueryToInput(articleQuery: GetArticleQuery): ArticleInputType {
  const { article } = articleQuery;

  return {
    title: article.title,
    perex: article.perex || '',
    published: article.published,
    segments: (article.segments || []).map((segment) => ({
      id: segment.id,
      segment_type: segment.segment_type,
      text_html: segment.text_html,
      text_slatejson: segment.text_slatejson,
      statements: segment.statements.map((statement) => statement.id),
    })),
  };
}

export class ArticleForm extends React.Component<IArticleFormProps> {
  public static defaultProps: Partial<IArticleFormProps> = {
    articleQuery: {
      article: {
        title: '',
        perex: '',
        slug: '',
        published: false,
        published_at: '',
        illustration: null,
        segments: [],
      },
    },
  };

  public render() {
    const { backPath, articleQuery, submitting, title } = this.props;

    if (!articleQuery) {
      return null;
    }

    const articleInput = mapQueryToInput(articleQuery);

    return (
      <ArticleInternalForm defaultValues={articleInput} onSubmit={this.props.onSubmit}>
        {({ onInputChange, onCheckboxChange, onImageChange, onAssociationChange }) => (
          <React.Fragment>
            <div className="float-right">
              <Link to={backPath} className="btn btn-secondary">
                Zpět
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginLeft: 7 }}
                disabled={submitting}
              >
                {submitting ? 'Ukládám ...' : 'Uložit'}
              </button>
            </div>

            <h3 style={{ marginTop: 7, marginBottom: 20 }}>{title}</h3>

            <div className="row">
              <div className="col-md-8">
                <h2 style={{ marginBottom: 20 }}>
                  <EditableText
                    placeholder="Upravit Název.."
                    defaultValue={articleInput.title}
                    onChange={onInputChange('title')}
                  />
                </h2>

                <div style={{ marginBottom: 20 }}>
                  <EditableText
                    maxLines={12}
                    minLines={3}
                    multiline={true}
                    placeholder="Zadejte perex..."
                    defaultValue={articleInput.perex}
                    onChange={onInputChange('perex')}
                  />
                </div>

                <SegmentManager
                  defaultValue={articleInput.segments || []}
                  onChange={onAssociationChange('segments')}
                />
              </div>

              <div className="col-md-4">
                <div className="form-row">
                  <ImageInput
                    // label="Ilustrační obrázek"
                    defaultValue={articleQuery.article.illustration}
                    // name="illustration"
                    onChange={onImageChange('illustration')}
                    renderImage={(src) => (
                      <ArticleIllustration illustration={src} title={articleInput.title} />
                    )}
                  />
                </div>

                <div className="form-row" style={{ marginTop: 20 }}>
                  <div className="form-group">
                    <Switch
                      defaultChecked={articleInput.published || false}
                      label="Zveřejněný článek"
                      onChange={onCheckboxChange('published')}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <DateInput
                      onChange={onInputChange('published_at')}
                      label="Datum zveřejnění"
                      placeholder="Zadejte datum zveřejnění"
                      name="published_at"
                      defaultValue={articleInput.published_at || ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </ArticleInternalForm>
    );
  }
}
