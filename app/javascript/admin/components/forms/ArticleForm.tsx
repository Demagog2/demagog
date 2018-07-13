/* eslint camelcase: 0 */

import * as React from 'react';

import { Button, Classes, EditableText, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

import { ArticleInputType, GetArticleQuery } from '../../operation-result-types';
import ArticleIllustration from '../ArticleIllustration';
import DateField from './controls/DateField';
import ImageField, { ImageValueType } from './controls/ImageField';
import { SegmentManager } from './controls/SegmentManager';
import SwitchField from './controls/SwitchField';
import FormGroup from './FormGroup';

export interface IArticleFormData extends ArticleInputType {
  illustration: ImageValueType;
}

interface IArticleFormProps {
  article?: GetArticleQuery['article'];
  onSubmit: (formData: ArticleInputType) => Promise<any>;
  title: string;
  backPath: string;
}

export class ArticleForm extends React.Component<IArticleFormProps> {
  public render() {
    const { article, backPath, title } = this.props;

    const initialValues = {
      title: article ? article.title : '',
      perex: article && article.perex ? article.perex : '',
      segments:
        article && article.segments
          ? article.segments.map((s) => ({
              id: s.id,
              segment_type: s.segment_type,
              text_html: s.text_html,
              text_slatejson: s.text_slatejson,
              statements: s.statements.map((statement) => statement.id),
            }))
          : [],
      illustration: article ? article.illustration : null,
      published: article ? article.published : false,
      published_at: article ? article.published_at : DateTime.local().toISODate(),
    };

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          const formData: IArticleFormData = values;

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

            <h2>{title}</h2>

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
                    marginBottom: '24px 0 12px 0',
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

                <div
                  style={{
                    marginBottom: 20,
                    fontFamily: 'Lato, sans-serif',
                    color: '#282828',
                    fontSize: '16.5px',
                    lineHeight: '24.75px',
                    fontWeight: 400,
                  }}
                >
                  <EditableText
                    maxLines={12}
                    minLines={3}
                    multiline={true}
                    placeholder="Zadejte perex..."
                    value={values.perex || ''}
                    onChange={(value) => setFieldValue('perex', value)}
                  />
                </div>

                <SegmentManager
                  defaultValue={values.segments}
                  onChange={(value) => setFieldValue('segments', value)}
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
