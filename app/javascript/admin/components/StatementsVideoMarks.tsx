import {
  Button,
  Classes,
  Dialog,
  Intent,
  NonIdealState,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import { TimePicker, TimePrecision } from '@blueprintjs/datetime';
import { IconNames } from '@blueprintjs/icons';
import { css } from 'emotion';
import { Field, FieldProps, Formik } from 'formik';
import * as React from 'react';
import { useQuery } from 'react-apollo';
import { RouteComponentProps } from 'react-router';

import { IVideo } from '../../article-factcheck-video/video/shared';
import YoutubeVideo from '../../article-factcheck-video/video/YoutubeVideo';
import * as ResultTypes from '../operation-result-types';
import { GetSourceWithStatementsAndVideoMarks } from '../queries/queries';
import { newlinesToBr } from '../utils';
import Breadcrumbs from './Breadcrumbs';
import SelectField from './forms/controls/SelectField';
import TextField from './forms/controls/TextField';
import FormGroup from './forms/FormGroup';
import Loading from './Loading';

export default function StatementsVideoMarks(props: RouteComponentProps<{ sourceId: string }>) {
  const { data, loading, refetch } = useQuery<
    ResultTypes.GetSourceWithStatementsAndVideoMarks,
    ResultTypes.GetSourceWithStatementsAndVideoMarksVariables
  >(GetSourceWithStatementsAndVideoMarks, {
    variables: { id: parseInt(props.match.params.sourceId, 10), includeUnpublished: true },
  });

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <NonIdealState title="Statement video marks" />;
  }

  return (
    <StatementsVideoMarksInner
      onSourceChange={() => {
        refetch();
      }}
      onStatementsChange={() => {
        refetch();
      }}
      source={data.source}
      statements={data.source.statements}
    />
  );
}

function StatementsVideoMarksInner({
  onSourceChange,
  source,
  statements,
}: {
  onSourceChange: () => void;
  onStatementsChange: () => void;
  source: ResultTypes.GetSourceWithStatementsAndVideoMarks['source'];
  statements: ResultTypes.GetSourceWithStatementsAndVideoMarks['source']['statements'];
}) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);

  const breadcrumbs = [
    { href: '/admin/sources', text: 'Seznam diskuzí' },
    { href: `/admin/sources/${source.id}`, text: source.name },
    { text: 'Propojení s videozáznamem' },
  ];

  // TODO: Fill from source
  const hasVideo = true;
  const videoType = 'youtube';
  const videoId = 'LHX2OdsApCc';

  let video: IVideo | null = null;
  const handleVideoReady = React.useCallback((v) => {
    video = v;
  }, []);

  const [videoTime, setVideoTime] = React.useState(0);
  React.useEffect(() => {
    const intervalHandle = window.setInterval(() => {
      if (video !== null) {
        setVideoTime(video.getTime());
      }
    }, 200);
    return () => {
      window.clearInterval(intervalHandle);
    };
  }, [setVideoTime]);

  const handleGoToMark = React.useCallback((mark: number) => {
    if (video !== null) {
      video.goToTime(mark);
    }
  }, []);

  const initialValues = React.useMemo(() => {
    return {
      marks: statements.reduce((carry, statement) => {
        // TODO: fill start & stop from actual statement marks properties
        carry[statement.id] = {
          start: 0,
          stop: 0,
        };
        return carry;
      }, {}),
    };
  }, [statements]);

  const onSubmit = React.useCallback((values) => {
    // TODO: add actual saving of video marks
    // tslint:disable-next-line:no-console
    console.log('-----', { values });
  }, []);

  return (
    <>
      {showVideoModal && (
        <VideoModal
          onRequestClose={() => setShowVideoModal(false)}
          onSaveCompleted={() => {
            onSourceChange();
            setShowVideoModal(false);
          }}
        />
      )}
      <Breadcrumbs items={breadcrumbs} />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div
              className={css`
                position: absolute;
                top: 107px;
                left: 260px;
                right: 30px;
                bottom: 40px;
                display: flex;
                flex-direction: column;
              `}
            >
              <div
                style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}
              >
                <h2 className={Classes.HEADING}>Propojení videozáznamu s výroky z diskuze</h2>
                {hasVideo && (
                  <Button type="submit" intent={Intent.PRIMARY}>
                    Uložit časování výroků
                  </Button>
                )}
              </div>
              <div
                className={css`
                  margin-top: 10px;
                  flex: 1 0 0px;
                  display: flex;
                  flex-direction: column;
                `}
              >
                {!hasVideo && (
                  <div>
                    <p>Diskuze zatím nemá přiřazený videozáznam</p>
                    <Button
                      intent={Intent.PRIMARY}
                      onClick={() => setShowVideoModal(true)}
                      text="Přiřadit videozáznam"
                    />
                  </div>
                )}
                {hasVideo && (
                  <div
                    className={css`
                      flex: 1 0 0px;
                      overflow-y: auto;
                      display: flex;
                    `}
                  >
                    <div style={{ flex: '1' }}>
                      {videoType === 'youtube' && (
                        <YoutubeVideo onReady={handleVideoReady} videoId={videoId} />
                      )}
                      <p style={{ marginTop: 15 }}>
                        Videozáznam {videoType}:{videoId}
                      </p>
                      <Button
                        onClick={() => setShowVideoModal(true)}
                        text="Přiřadit jiný videozáznam"
                      />
                    </div>
                    <div
                      className={css`
                        flex: 1;
                        overflow-y: auto;
                      `}
                    >
                      {statements.map((statement) => (
                        <Field
                          key={statement.id}
                          name={`marks.${statement.id}`}
                          component={StatementInput}
                          onGoToMark={handleGoToMark}
                          statement={statement}
                          videoTime={videoTime}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}

function VideoModal({
  onRequestClose,
  onSaveCompleted,
}: {
  onRequestClose: () => void;
  onSaveCompleted: () => void;
}) {
  // TODO: fill from source
  const initialValues = {
    video_type: 'youtube',
    video_id: '',
  };

  const typeOptions = [
    { label: 'YouTube', value: 'youtube' },
    // { label: 'Facebook', value: 'facebook' },
  ];

  return (
    <Dialog isOpen onClose={onRequestClose} title="Přiřadit videozáznam">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          // tslint:disable-next-line:no-console
          console.log('-----', { values });

          // TODO: change video_type and video_id of source
          onSaveCompleted();
        }}
      >
        {({ handleSubmit, values }) => {
          let videoIdLabel = '';
          let videoIdFormHelperText = '';
          if (values.video_type === 'youtube') {
            videoIdLabel = 'YouTube hash videa';
            videoIdFormHelperText =
              'Hash najdete v adresovém řádku prohlížeče v parametru v,' +
              ' tedy například hash videa https://www.youtube.com/watch?v=dQw4w9WgXcQ je dQw4w9WgXcQ';
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
                  <Button text="Zpět" onClick={onRequestClose} />
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

const StatementInput = ({
  field,
  form,
  onGoToMark,
  statement,
  videoTime,
}: FieldProps & {
  onGoToMark: (mark: number) => void;
  statement: ResultTypes.GetSourceStatements['statements'][0];
  videoTime: number;
}) => {
  const hasMarksFilled = field.value.start > 0 && field.value.stop > 0;
  const isVideoBetweenMarks =
    hasMarksFilled && videoTime >= field.value.start && videoTime <= field.value.stop;

  let backgroundColor = 'transparent';
  if (isVideoBetweenMarks) {
    backgroundColor = '#cbebff';
  } else if (!hasMarksFilled) {
    backgroundColor = '#fff5d8';
  }

  const handleStartChange = React.useCallback(
    (changedStart) => {
      form.setFieldValue(`${field.name}.start`, changedStart);
      if (changedStart > field.value.stop) {
        form.setFieldValue(`${field.name}.stop`, changedStart);
      }
    },
    [field.name, field.value, form.setFieldValue],
  );

  const handleStopChange = React.useCallback(
    (changedStop) => {
      form.setFieldValue(`${field.name}.stop`, changedStop);
    },
    [field.name, form.setFieldValue],
  );

  const goToStartMark = React.useCallback(() => {
    onGoToMark(field.value.start);
  }, [field.value.start]);
  const goToStopMark = React.useCallback(() => {
    onGoToMark(field.value.stop);
  }, [field.value.stop]);

  return (
    <div
      className={css`
        padding: 15px;
        border-bottom: 1px solid #aaa;
      `}
      style={{ backgroundColor }}
    >
      <div>
        <strong>
          {statement.speaker.firstName} {statement.speaker.lastName}:
        </strong>
        <br />
        {newlinesToBr(statement.content)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
        <div style={{ flex: '0 0 auto' }}>
          <VideoMarkInput onChange={handleStartChange} value={field.value.start} />
        </div>
        <div style={{ flex: '0 0 auto', marginLeft: 7 }}>
          <Tooltip content="Skočit ve videu na zadaný čas" position={Position.TOP}>
            <Button icon={IconNames.PLAY} onClick={goToStartMark} />
          </Tooltip>
        </div>
        <div style={{ flex: '0 0 auto', marginLeft: 20 }}>—</div>
        <div style={{ flex: '0 0 auto', marginLeft: 20 }}>
          <VideoMarkInput onChange={handleStopChange} value={field.value.stop} />
        </div>
        <div style={{ flex: '0 0 auto', marginLeft: 7 }}>
          <Tooltip content="Skočit ve videu na zadaný čas" position={Position.TOP}>
            <Button icon={IconNames.PLAY} onClick={goToStopMark} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const VideoMarkInput = ({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) => {
  const timePickerValue: Date = React.useMemo(() => {
    let seconds = value;

    const hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  }, [value]);

  const handleTimePickerChange = React.useCallback(
    (changedTimePickerValue: Date) => {
      const changedValue =
        changedTimePickerValue.getHours() * 3600 +
        changedTimePickerValue.getMinutes() * 60 +
        changedTimePickerValue.getSeconds();
      onChange(changedValue);
    },
    [onChange],
  );

  return (
    <TimePicker
      onChange={handleTimePickerChange}
      precision={TimePrecision.SECOND}
      selectAllOnFocus
      showArrowButtons
      value={timePickerValue}
    />
  );
};
