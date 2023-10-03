import React from 'react';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import { Classes, Button, Intent, RadioGroup, Radio } from '@blueprintjs/core';
import * as yup from 'yup';
import TextField from './controls/TextField';
import FormGroup from './FormGroup';
import { StatementType } from '../../operation-result-types';
import { STATEMENT_TYPES } from '../../constants';

export interface ITagFormValues {
  name: string;
  forStatementType: StatementType;
}

interface ITagFormProps {
  onSubmit: (values: ITagFormValues) => Promise<void>;
}

const initialValues: ITagFormValues = {
  name: '',
  forStatementType: StatementType.factual,
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Je třeba vyplnit jméno'),
  forStatementType: yup
    .string()
    .oneOf([StatementType.factual, StatementType.newyears, StatementType.promise])
    .required(),
});

export function TagForm(props: ITagFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        props.onSubmit(values).finally(() => { setSubmitting(false); });
      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form>
          <div style={{ float: 'right' }}>
            <Link to="/admin/tags" className={Classes.BUTTON}>
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

          <h2 className={Classes.HEADING}>Vytvořit štítek</h2>

          <FormGroup label="Název štítku" name="name">
            <TextField name="name" />
          </FormGroup>

          <FormGroup label="Pro výroky typu" name="forStatementType">
            <RadioGroup
              name="forStatementType"
              onChange={handleChange}
              selectedValue={values.forStatementType}
            >
              <Radio label={STATEMENT_TYPES[StatementType.factual]} value={StatementType.factual} />
              <Radio label={STATEMENT_TYPES[StatementType.promise]} value={StatementType.promise} />
              <Radio
                label={STATEMENT_TYPES[StatementType.newyears]}
                value={StatementType.newyears}
              />
            </RadioGroup>
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
}
