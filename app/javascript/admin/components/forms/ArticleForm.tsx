/* eslint camelcase: 0 */

import * as React from 'react';

import { Button, Classes, EditableText, FormGroup, Intent, Switch } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import { ArticleInputType, GetArticleQuery } from '../../operation-result-types';
import ArticleIllustration from '../ArticleIllustration';
import DateInput from './controls/DateInput2';
import ImageInput from './controls/ImageInput';
import { SegmentManager } from './controls/SegmentManager';
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
    published_at: article.published_at,
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
        {({ onInputChange, onCheckboxChange, onImageChange, onAssociationChange }, data) => (
          <React.Fragment>
            <div style={{ float: 'right' }}>
              <Link to={backPath} className={Classes.BUTTON}>
                Zpět
              </Link>
              <Button
                type="submit"
                intent={Intent.PRIMARY}
                style={{ marginLeft: 7 }}
                disabled={submitting}
                text={submitting ? 'Ukládám ...' : 'Uložit'}
              />
            </div>

            <h2>{title}</h2>

            <div style={{ display: 'flex' }}>
              <div style={{ flex: '2 2', overflow: 'hidden', padding: 10 }}>
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

              <div style={{ flex: '1 1', marginLeft: 15 }}>
                <FormGroup label="Ilustrační obrázek">
                  <ImageInput
                    defaultValue={articleQuery.article.illustration}
                    onChange={onImageChange('illustration')}
                    renderImage={(src) => (
                      <ArticleIllustration illustration={src} title={articleInput.title} />
                    )}
                  />
                </FormGroup>

                <Switch
                  defaultChecked={articleInput.published || false}
                  label="Zveřejněný článek"
                  onChange={onCheckboxChange('published')}
                  style={{ marginBottom: 20 }}
                />

                <FormGroup label="Datum zveřejnění" labelFor="published-at">
                  <DateInput
                    id="published-at"
                    value={data.published_at || null}
                    onChange={onInputChange('published_at')}
                  />
                </FormGroup>
              </div>
            </div>
          </React.Fragment>
        )}
      </ArticleInternalForm>
    );
  }
}
