/* eslint camelcase: 0 */

import * as React from 'react';

import { Button, Classes, EditableText, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

import { ArticleInput, GetArticle as GetArticleQuery } from '../../operation-result-types';
import DateField from '../forms/controls/DateField';
import ImageField, { ImageValueType } from '../forms/controls/ImageField';
import SwitchField from '../forms/controls/SwitchField';
import FormGroup from '../forms/FormGroup';
import ArticleIllustration from './ArticleIllustration';
import ArticleSingleStatementSegment from './ArticleSingleStatementSegment';

const ARTICLE_TYPE_SINGLE_STATEMENT = 'single_statement';

export interface IArticleSingleStatementFormData extends ArticleInput {
  illustration: ImageValueType;
}

interface IArticleSingleStatementFormProps {
  article?: GetArticleQuery['article'];
  onSubmit: (formData: ArticleInput) => Promise<any>;
  title: string;
  backPath: string;
}

export class ArticleSingleStatementForm extends React.Component<IArticleSingleStatementFormProps> {
  public render() {
    const { article, backPath, title } = this.props;

    let segmentStatementId: string | null = null;
    if (
      article &&
      article.segments &&
      article.segments.length === 1 &&
      article.segments[0].segmentType === 'single_statement'
    ) {
      segmentStatementId = article.segments[0].statementId;
    }

    const initialValues = {
      title: article ? article.title : '',
      illustration: article ? article.illustration : null,
      published: article ? article.published : false,
      published_at: article ? article.publishedAt : DateTime.local().toISODate(),
      segments: [
        {
          segment_type: 'single_statement',
          statement_id: segmentStatementId,
        },
      ],
    };

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          const formData: IArticleSingleStatementFormData = {
            articleType: ARTICLE_TYPE_SINGLE_STATEMENT,
            illustration: values.illustration,
            published: values.published,
            publishedAt: values.published_at,
            title: values.title,
            perex: null,
            segments: [
              {
                segmentType: values.segments[0].segment_type,
                statementId: values.segments[0].statement_id,
              },
            ],
          };

          this.props
            .onSubmit(formData)
            .then(() => {
              setSubmitting(false);
            })
            .catch(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div style={{ float: 'right' }}>
              <Link to={backPath} className={Classes.BUTTON}>
                Zpět
              </Link>
              <Button
                type="submit"
                intent={Intent.PRIMARY}
                style={{ marginLeft: 7 }}
                disabled={isSubmitting}
                text={isSubmitting ? 'Ukládám…' : 'Uložit'}
              />
            </div>

            <h2 className={Classes.HEADING}>{title}</h2>

            <div style={{ display: 'flex' }}>
              <div
                style={{
                  flex: '2 2',
                  padding: 30,
                  margin: 6,
                  backgroundColor: '#f4f9fd',
                  boxShadow: '0 0 6px #999',
                }}
              >
                <h2
                  style={{
                    marginBottom: 36,
                    // TODO: make sure Lato is loaded
                    fontFamily: 'Lato, sans-serif',
                    color: '#3c325c',
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  <EditableText
                    placeholder="Upravit název…"
                    onChange={(value) => setFieldValue('title', value)}
                    value={values.title}
                  />
                </h2>

                <ArticleSingleStatementSegment
                  segment={values.segments[0]}
                  onChange={(value) => setFieldValue('segments.0', value)}
                />
              </div>

              <div style={{ flex: '1 1', marginLeft: 15 }}>
                <FormGroup label="Ilustrační obrázek" name="illustration">
                  <ImageField
                    name="illustration"
                    renderImage={(src) => (
                      <ArticleIllustration illustration={src} title={values.title} />
                    )}
                  />
                </FormGroup>

                <SwitchField
                  name="published"
                  label="Zveřejněný článek"
                  style={{ marginBottom: 20 }}
                />

                <FormGroup label="Datum zveřejnění" name="published_at">
                  <DateField name="published_at" />
                </FormGroup>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
