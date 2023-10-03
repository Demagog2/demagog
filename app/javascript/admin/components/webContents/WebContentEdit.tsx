import { Button, Classes, Intent } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { addFlashMessage } from '../../actions/flashMessages';
import TextField from '../forms/controls/TextField';
import RichTextEditorField from '../forms/controls/RichTextEditorField';
import FormGroup from '../forms/FormGroup';
import Breadcrumbs from '../Breadcrumbs';
import type * as ResultTypes from '../../operation-result-types';
import { GetWebContent } from '../../queries/queries';
import { UpdateWebContent } from '../../queries/mutations';

const WebContentEdit = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const webContentId = params.id;

  const { data: dataGetWebContent } = useQuery<
  ResultTypes.GetWebContent,
  ResultTypes.GetWebContentVariables
  >(GetWebContent, {
    fetchPolicy: 'cache-and-network',
    variables: { id: webContentId || '' },
  });

  const [mutateUpdateWebContent] = useMutation<
  ResultTypes.UpdateWebContent,
  ResultTypes.UpdateWebContentVariables
  >(UpdateWebContent);

  if (!dataGetWebContent) {
    return null;
  }

  const { webContent } = dataGetWebContent;

  const breadcrumbs = [
    { href: '/admin/web-contents', text: 'Webový obsah' },
    { text: webContent.name },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div
        className={css`
          margin-top: 20px;
        `}
      >
        <Formik
          initialValues={{ data: webContent.data }}
          onSubmit={(values, { setSubmitting }) => {
            mutateUpdateWebContent({
              variables: {
                id: webContent.id,
                webContentInput: {
                  data: values.data,
                },
              },
            }).then(() => {
              dispatch(addFlashMessage('Obsah úspěšně uložen', 'success'));
              setSubmitting(false);
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div
                className={css`
                  display: flex;
                  justify-content: flex-end;
                `}
              >
                <Button
                  type="submit"
                  intent={Intent.PRIMARY}
                  disabled={isSubmitting}
                  text={isSubmitting ? 'Ukládám…' : 'Uložit'}
                />
              </div>

              {webContent.urlPath && (
                <FormSectionDiv first>
                  <FormSectionTitleDiv>
                    <h4 className={Classes.HEADING}>URL obsahu</h4>
                  </FormSectionTitleDiv>
                  <FormSectionContentDiv>
                    <a href={`https://demagog.cz${webContent.urlPath}`} target="_blank" rel="noreferrer">
                      https://demagog.cz{webContent.urlPath}
                    </a>
                  </FormSectionContentDiv>
                </FormSectionDiv>
              )}

              <FormSectionDiv first={!webContent.urlPath}>
                <FormSectionTitleDiv>
                  <h4 className={Classes.HEADING}>Části obsahu</h4>
                </FormSectionTitleDiv>
                <FormSectionContentDiv>
                  {webContent.structure.map((structureItem: IStructureItem, index) => (
                    <div key={index}>
                      {structureItem.item_type === 'heading' && (
                        <FormGroup name={`data.${structureItem.key}`} label={structureItem.name}>
                          <TextField name={`data.${structureItem.key}`} />
                        </FormGroup>
                      )}
                      {structureItem.item_type === 'richtext' && (
                        <FormGroup name={`data.${structureItem.key}`} label={structureItem.name}>
                          <RichTextEditorField name={`data.${structureItem.key}`} />
                        </FormGroup>
                      )}
                    </div>
                  ))}
                </FormSectionContentDiv>
              </FormSectionDiv>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default WebContentEdit;

interface IStructureItem {
  key: string;
  item_type: 'heading' | 'richtext';
  name: string;
}

const FormSectionDiv = styled.div<{ first?: boolean }>`
  display: flex;
  margin-top: ${(props) => (props.first ? 10 : 30)}px;
`;

const FormSectionTitleDiv = styled.div`
  flex: 0 0 200px;
  margin-right: 15px;
`;

const FormSectionContentDiv = styled.div`
  flex: 1 1;
`;
