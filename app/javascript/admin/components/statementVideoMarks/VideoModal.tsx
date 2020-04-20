import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import * as React from 'react';
import SelectField from '../forms/controls/SelectField';
import TextField from '../forms/controls/TextField';
import FormGroup from '../forms/FormGroup';

interface IVideoFormValues {
  video_type: string;
  video_id: string;
}

interface IVideoModalProps {
  source: IVideoFormValues;
  onRequestClose(): void;
  onSubmit(values: IVideoFormValues): void;
}

export function VideoModal(props: IVideoModalProps) {
  const initialValues = {
    video_type: props.source.video_type,
    video_id: props.source.video_id,
  };

  const typeOptions = [
    { label: 'YouTube', value: 'youtube' },
    { label: 'Audio', value: 'audio' },
    // TODO: uncomment when facebook video implementation is added
    // { label: 'Facebook', value: 'facebook' },
  ];

  return (
    <Dialog isOpen onClose={props.onRequestClose} title="Přiřadit videozáznam">
      <Formik initialValues={initialValues} onSubmit={props.onSubmit}>
        {({ handleSubmit, values }) => {
          let videoIdLabel = '';
          let videoIdFormHelperText = '';
          if (values.video_type === 'youtube') {
            videoIdLabel = 'YouTube hash videa';
            videoIdFormHelperText =
              'Hash najdete v adresovém řádku prohlížeče v parametru v,' +
              ' tedy například hash videa https://www.youtube.com/watch?v=dQw4w9WgXcQ je dQw4w9WgXcQ';
          } else if (values.video_type === 'audio') {
            videoIdLabel = 'URL audio souboru';
          } else if (values.video_type === 'facebook') {
            videoIdLabel = 'Facebook ID videa';
            videoIdFormHelperText =
              'ID najdete v adresovém řádku prohlížeče za částí /videos/,' +
              ' tedy například ID videa https://www.facebook.com/musicretrobest/videos/3293833073961965/' +
              ' je 3293833073961965';
          }

          return (
            <form onSubmit={handleSubmit}>
              <div className={Classes.DIALOG_BODY}>
                <FormGroup label="Platforma, kde je videozáznam dostupný" name="video_type">
                  <SelectField name="video_type" options={typeOptions} />
                </FormGroup>
                <FormGroup name="video_id" label={videoIdLabel}>
                  <>
                    <TextField name="video_id" />
                    <div className={Classes.FORM_HELPER_TEXT}>{videoIdFormHelperText}</div>
                  </>
                </FormGroup>
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button text="Zpět" onClick={props.onRequestClose} />
                  <Button type="submit" intent={Intent.PRIMARY} text="Uložit" />
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
