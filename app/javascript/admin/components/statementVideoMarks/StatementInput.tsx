import { Button, Position, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { css } from 'emotion';
import { FieldProps } from 'formik';
import * as React from 'react';
import * as ResultTypes from '../../operation-result-types';
import { newlinesToBr } from '../../utils';
import { VideoMarkInput } from './VideoMarkInput';

export const StatementInput = ({
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
