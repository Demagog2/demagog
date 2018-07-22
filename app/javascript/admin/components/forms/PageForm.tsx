/* eslint camelcase: 0 */

import * as React from 'react';

import { Button, Classes, EditableText, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';

import { GetPageQuery, PageInputType } from '../../operation-result-types';
import RichTextEditor from '../RichTextEditor';
import SwitchField from './controls/SwitchField';

interface IPageFormProps {
  page?: GetPageQuery['page'];
  onSubmit: (formData: PageInputType) => Promise<any>;
  title: string;
  backPath: string;
}

export class PageForm extends React.Component<IPageFormProps> {
  public render() {
    const { page, backPath, title } = this.props;

    const initialValues = {
      title: page ? page.title : '',
      text_html: page ? page.text_html : '',
      text_slatejson: page ? page.text_slatejson : null,
      published: page ? page.published : false,
    };

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          const formData: PageInputType = values;

          this.props.onSubmit(formData).finally(() => setSubmitting(false));
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

                <RichTextEditor
                  value={values.text_slatejson}
                  onChange={(json, html) => {
                    setFieldValue('text_html', html);
                    setFieldValue('text_slatejson', json);
                  }}
                  contentsStyle={{
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '16px',
                    lineHeight: '25.6px',
                    letterSpacing: '0.4px',
                  }}
                />
              </div>

              <div style={{ flex: '1 1', marginLeft: 15 }}>
                <SwitchField
                  name="published"
                  label="Zveřejněná stránka"
                  style={{ marginBottom: 20 }}
                />

                {/* <FormGroup label="Datum zveřejnění" name="published_at">
                  <DateField name="published_at" />
                </FormGroup> */}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
