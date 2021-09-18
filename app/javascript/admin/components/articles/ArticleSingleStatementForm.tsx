import * as React from 'react';

import { Button, Classes, Dialog, EditableText, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

import { generateIllustrationImageForTweet } from '../../api';
import { ArticleInput, GetArticle as GetArticleQuery } from '../../operation-result-types';
import DateField from '../forms/controls/DateField';
import ImageField, { ImageValueType } from '../forms/controls/ImageField';
import SwitchField from '../forms/controls/SwitchField';
import TextField from '../forms/controls/TextField';
import FormGroup from '../forms/FormGroup';
import PreviewableArticleIllustration from './PreviewableArticleIllustration';
import ArticleSingleStatementSegment from './ArticleSingleStatementSegment';
import { useFlashMessage } from '../../hooks/use-flash-messages';

const ARTICLE_TYPE_SINGLE_STATEMENT = 'single_statement';

export interface IArticleSingleStatementFormData extends ArticleInput {
  illustration: ImageValueType;
}

export const ArticleSingleStatementForm = ({
  article,
  backPath,
  onSubmit,
  title,
}: {
  article?: GetArticleQuery['article'];
  onSubmit: (formData: ArticleInput) => Promise<any>;
  title: string;
  backPath: string;
}) => {
  let segmentStatementId: string | null = null;
  if (
    article &&
    article.segments &&
    article.segments.length === 1 &&
    article.segments[0].segmentType === 'single_statement'
  ) {
    segmentStatementId = article.segments[0].statementId;
  }

  const [showGenerateImageForTweetModal, setShowGenerateImageForTweetModal] = React.useState(false);

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

        onSubmit(formData)
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
          {showGenerateImageForTweetModal && (
            <GenerateImageForTweetModal
              onHide={() => setShowGenerateImageForTweetModal(false)}
              onSave={(file) => {
                setFieldValue('illustration', file);
                setShowGenerateImageForTweetModal(false);
              }}
            />
          )}

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
                  additionalActions={
                    <Button
                      onClick={() => setShowGenerateImageForTweetModal(true)}
                      style={{ marginTop: 7 }}
                    >
                      Vygenerovat obrázek pro tweet
                    </Button>
                  }
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
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const GenerateImageForTweetModal = ({ onHide, onSave }) => {
  const [tweetImageFile, setTweetImageFile] = React.useState<File | null>(null);
  const addFlashMessage = useFlashMessage();

  return (
    <Dialog isOpen onClose={onHide} title="Vygenerovat ilustrační obrázek pro tweet">
      <Formik
        initialValues={{ tweetUrl: '', withAttachment: false }}
        onSubmit={(values, { setSubmitting }) => {
          generateIllustrationImageForTweet(values.tweetUrl, {
            withAttachment: values.withAttachment,
          })
            .then((response) => {
              if (response.ok) {
                response.json().then((payload) => {
                  fetch(payload.data_url)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const file = new File([blob], payload.name, { type: payload.mime });
                      (file as any).preview = window.URL.createObjectURL(file);
                      setTweetImageFile(file);
                    });
                });
              }
            })
            .catch(() => addFlashMessage('Při generování obrázku došlo k chybě.', 'error'))
            .finally(() => setSubmitting(false));
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              handleSubmit(e);
            }}
          >
            <div className={Classes.DIALOG_BODY}>
              <FormGroup label="URL tweetu" name="tweetUrl">
                <>
                  <TextField name="tweetUrl" />
                  <div className={Classes.FORM_HELPER_TEXT}>
                    Např. https://twitter.com/kalousekm/status/1294204759239528448
                  </div>
                </>
              </FormGroup>
              <SwitchField
                name="withAttachment"
                label="Screenshot tweetu i s přiloženou fotkou/videem/odkazem"
              />
              <Button
                type="submit"
                text={isSubmitting ? 'Generuji ...' : 'Vygenerovat'}
                disabled={isSubmitting}
              />
              {tweetImageFile && (
                <img
                  src={(tweetImageFile as any).preview}
                  alt=""
                  style={{ width: '100%', marginTop: 20 }}
                />
              )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button text="Zpět" onClick={onHide} />
                <Button
                  intent={Intent.PRIMARY}
                  text="Uložit k článku"
                  disabled={tweetImageFile === null}
                  onClick={() => onSave(tweetImageFile)}
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};
