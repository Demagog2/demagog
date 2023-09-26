import React from 'react';
import { Classes, Button, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { Form, Formik } from 'formik';
import TextField from './controls/TextField';
import TextareaField from './controls/TextareaField';
import SwitchField from './controls/SwitchField';
import SelectField from '../forms/controls/SelectField';
import { GetArticleTag as GetArticleTagQuery } from '../../operation-result-types';
import FormGroup from './FormGroup';
import * as yup from 'yup';

export interface IArticleTagFormValues {
  title: string;
  slug: string;
  description: string;
  icon: string;
  published: boolean;
  stats: string;
  order: string;
}

interface IArticleTagFormProps {
  title: string;
  articleTag?: GetArticleTagQuery['articleTag'];
  onSubmit: (values: IArticleTagFormValues) => Promise<any>;
}

const validationSchema = yup.object().shape({
  title: yup.string().required('Je třeba vyplnit jméno'),
  slug: yup.string().required('Je třeba vyplnit url'),
});

const ICON_OPTIONS = [
  { label: 'Žádná', value: '0' },
  { label: 'Základní', value: '1' },
  { label: 'Prezidentská', value: '2' },
  { label: 'Slovensko', value: '3' },
  { label: 'Ukrajina', value: '4' },
];

const STATS_OPTIONS = [
  { label: 'Žádná', value: '0' },
  { label: 'Články', value: '1' },
  { label: 'Výroky', value: '2' },
];

export class ArticleTagForm extends React.Component<IArticleTagFormProps> {
  public render() {
    const { articleTag, title } = this.props;
    const initialValues: IArticleTagFormValues = {
      title: articleTag?.title ?? '',
      slug: articleTag?.slug ?? '',
      description: articleTag?.description ?? '',
      icon: articleTag?.icon ?? '0',
      published: articleTag?.published ?? false,
      stats: articleTag?.stats ?? '0',
      order: articleTag?.order ?? '0',
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          this.props.onSubmit(values).finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ float: 'right' }}>
              <Link to="/admin/article-tags" className={Classes.BUTTON}>
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
                <FormGroup label="Název tagu" name="title">
                  <TextField name="title" />
                </FormGroup>
                <FormGroup label="Url tagu (slug)" name="slug">
                  <TextField name="slug" />
                </FormGroup>
                <FormGroup label="Popis" name="description">
                  <TextareaField name="description" rows={10} />
                </FormGroup>
              </div>
              <div style={{ flex: '1 1', marginLeft: 15 }}>
                <div style={{ marginTop: 15 }}>
                  <FormGroup label="Pozice" name="order">
                    <TextField name="order" />
                  </FormGroup>
                  <SwitchField
                    name="published"
                    label="Zveřejněný tag"
                    style={{ marginBottom: 20 }}
                  />
                  <FormGroup label="Ikona" name="icon">
                    <SelectField name="icon" options={ICON_OPTIONS} />
                  </FormGroup>
                  <FormGroup label="Statistika" name="stats">
                    <SelectField name="stats" options={STATS_OPTIONS} />
                  </FormGroup>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
