/* eslint camelcase: 0 */

import * as React from 'react';

import {
  Button,
  Classes,
  EditableText,
  Intent,
  Menu,
  MenuItem,
  Popover,
  Position,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { css } from 'emotion';

import { ArticleInput, GetArticle as GetArticleQuery } from '../../operation-result-types';
import { isSameOrAfterToday } from '../../utils';
import DateField from '../forms/controls/DateField';
import ImageField, { ImageValueType } from '../forms/controls/ImageField';
import SelectField from '../forms/controls/SelectField';
import SwitchField from '../forms/controls/SwitchField';
import FormGroup from '../forms/FormGroup';
import PreviewableArticleIllustration from './PreviewableArticleIllustration';
import ArticlePromiseSegment from './ArticlePromiseSegment';
import ArticleSourceStatementsSegment from './ArticleSourceStatementsSegment';
import ArticleTextSegment from './ArticleTextSegment';
import ArticleTagsSelect from '../forms/controls/ArticleTagsSelect';
import SelectComponentField from '../forms/controls/SelectComponentField';

const ARTICLE_TYPE_DEFAULT = 'default';
const ARTICLE_TYPE_STATIC = 'static';
const ARTICLE_TYPE_FACEBOOK_FACTCHECK = 'facebook_factcheck';

const ARTICLE_TYPE_OPTIONS = [
  { label: 'Ověřeno', value: ARTICLE_TYPE_DEFAULT },
  { label: 'Komentář', value: ARTICLE_TYPE_STATIC },
  { label: 'Facebook factcheck', value: ARTICLE_TYPE_FACEBOOK_FACTCHECK },
];

type SegmentType = 'text' | 'source_statements' | 'promise';

export interface IArticleFormData extends ArticleInput {
  illustration: ImageValueType;
}

interface IArticleFormProps {
  article?: GetArticleQuery['article'];
  onSubmit: (formData: ArticleInput) => Promise<any>;
  title: string;
  backPath: string;
}

export class ArticleForm extends React.Component<IArticleFormProps> {
  public render() {
    const { article, backPath, title } = this.props;

    const initialValues = {
      article_type: article ? article.articleType : ARTICLE_TYPE_DEFAULT,
      title: article ? article.title : '',
      perex: article && article.perex ? article.perex : '',
      segments:
        article && article.segments
          ? article.segments.map((s) => ({
              id: s.id,
              segment_type: s.segmentType as SegmentType,
              text_html: s.textHtml,
              text_slatejson: s.textSlatejson,
              source_id: s.source ? s.source.id : null,
              promise_url: s.promiseUrl,
            }))
          : [],
      illustration: article ? article.illustration : null,
      published: article ? article.published : false,
      published_at: article ? article.publishedAt : DateTime.local().toISODate(),
      articleTags: article && article.articleTags
       ? article.articleTags?.map((t) => t.id) : [],
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          article_type: yup
            .string()
            .oneOf([ARTICLE_TYPE_DEFAULT, ARTICLE_TYPE_STATIC, ARTICLE_TYPE_FACEBOOK_FACTCHECK]),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData: IArticleFormData = {
            articleType: values.article_type,
            illustration: values.illustration,
            perex: values.perex,
            published: values.published,
            publishedAt: values.published_at,
            segments: values.segments.map((s) => ({
              id: s.id,
              segmentType: s.segment_type,
              textHtml: s.text_html,
              textSlatejson: s.text_slatejson,
              sourceId: s.source_id,
              promiseUrl: s.promise_url,
            })),
            title: values.title,
            articleTags: values.articleTags ? values.articleTags : [],
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
                style={{ flex: '2 2' }}
              >
                <div
                  style={{
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

                  <FieldArray
                    name="segments"
                    render={(arrayHelpers) => (
                      <div>
                        {values.segments.map((segment, index) => (
                          <div key={`${segment.id}-${index}`}>
                            <AddSegmentButton
                              onAdd={(type) => arrayHelpers.insert(index, createNewSegment(type))}
                            />

                            <Field
                              name={`segments.${index}`}
                              render={({ field, form }: FieldProps) => (
                                <>
                                  {segment.segment_type === 'text' && (
                                    <ArticleTextSegment
                                      segment={field.value}
                                      onChange={(value) => form.setFieldValue(field.name, value)}
                                      onRemove={() => arrayHelpers.remove(index)}
                                    />
                                  )}

                                  {segment.segment_type === 'source_statements' && (
                                    <ArticleSourceStatementsSegment
                                      segment={field.value}
                                      onChange={(value) => form.setFieldValue(field.name, value)}
                                      onRemove={() => arrayHelpers.remove(index)}
                                    />
                                  )}

                                  {segment.segment_type === 'promise' && (
                                    <ArticlePromiseSegment
                                      segment={field.value}
                                      onChange={(value) => form.setFieldValue(field.name, value)}
                                      onRemove={() => arrayHelpers.remove(index)}
                                    />
                                  )}
                                </>
                              )}
                            />
                          </div>
                        ))}
                        <AddSegmentButton
                          onAdd={(type) => arrayHelpers.push(createNewSegment(type))}
                        />
                      </div>
                    )}
                  />
                </div>
                <div style={{ flex: '1 0 0px', margin: 6, marginTop: 30 }}>
                  <FormGroup
                    label="Tagy"
                    name="articleTags"
                    inline
                    className={css`
                      .bp3-form-content {
                        flex: 1 0 0px;
                      }
                    `}
                  >
                    <SelectComponentField name="articleTags">
                      {(renderProps) => (
                        <ArticleTagsSelect
                          {...renderProps}
                        />
                      )}
                    </SelectComponentField>
                  </FormGroup>
                </div>
              </div>
              <div style={{ flex: '1 1', marginLeft: 15 }}>
                <FormGroup label="Typ článku" name="article_type">
                  <SelectField name="article_type" options={ARTICLE_TYPE_OPTIONS} />
                </FormGroup>

                <FormGroup label="Ilustrační obrázek" name="illustration">
                  <ImageField
                    name="illustration"
                    renderImage={(src) => (
                      <PreviewableArticleIllustration illustration={src} title={values.title} />
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

                {article?.articleType === ARTICLE_TYPE_FACEBOOK_FACTCHECK &&
                  article.published &&
                  article.publishedAt &&
                  isSameOrAfterToday(article.publishedAt) && (
                    <div>
                      <a href={`/diskuze/${article.slug}`} target="_blank">
                        Veřejný odkaz
                      </a>
                    </div>
                  )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

interface IAddSegmentButtonProps {
  onAdd(type: SegmentType): void;
}

function AddSegmentButton(props: IAddSegmentButtonProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <Popover
        content={
          <Menu>
            <MenuItem text="Textový segment" onClick={() => props.onAdd('text')} />
            <MenuItem text="Výrokový segment" onClick={() => props.onAdd('source_statements')} />
            <MenuItem text="Slib vlády Andreje Babiše" onClick={() => props.onAdd('promise')} />
          </Menu>
        }
        position={Position.BOTTOM_RIGHT}
        minimal
      >
        <Button icon={IconNames.PLUS} text="Přidat segment článku…" />
      </Popover>
    </div>
  );
}

function createNewSegment(type: SegmentType) {
  return {
    segment_type: type,
    text_html: null,
    text_slatejson: null,
    source_id: null,
  };
}
