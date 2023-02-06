import React from 'react';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_LABELS,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../constants';
import { Button, Position, Tooltip } from '@blueprintjs/core';

interface IEvaluationStatusInputProps {
  disabled: boolean;
  enabledChanges: string[];
  tooltipContent: string | null;
  value: string;
  onChange: (value: string) => void;
}

export class EvaluationStatusInput extends React.Component<IEvaluationStatusInputProps> {
  public onChange = (value: string) => () => {
    if (!this.props.disabled) {
      this.props.onChange(value);
    }
  };

  public render() {
    const { disabled, enabledChanges, tooltipContent, value } = this.props;

    return (
      <>
        <p style={{ marginBottom: 5 }}>{ASSESSMENT_STATUS_LABELS[value]}</p>

        <Tooltip
          disabled={tooltipContent === null || !disabled}
          content={tooltipContent || ''}
          position={Position.TOP}
        >
          <>
            {value === ASSESSMENT_STATUS_BEING_EVALUATED && (
              <Button
                disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_APPROVAL_NEEDED)}
                onClick={this.onChange(ASSESSMENT_STATUS_APPROVAL_NEEDED)}
                text="Posunout ke kontrole"
              />
            )}
            {value === ASSESSMENT_STATUS_APPROVAL_NEEDED && (
              <>
                <Button
                  disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_BEING_EVALUATED)}
                  onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
                  text="Vrátit ke zpracování"
                />
                <Button
                  disabled={
                    disabled || !enabledChanges.includes(ASSESSMENT_STATUS_PROOFREADING_NEEDED)
                  }
                  onClick={this.onChange(ASSESSMENT_STATUS_PROOFREADING_NEEDED)}
                  text="Posunout ke korektuře"
                />
              </>
            )}
            {value === ASSESSMENT_STATUS_PROOFREADING_NEEDED && (
              <>
                <Button
                  disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_BEING_EVALUATED)}
                  onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
                  text="Vrátit ke zpracování"
                />
                <Button
                  disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_APPROVED)}
                  onClick={this.onChange(ASSESSMENT_STATUS_APPROVED)}
                  text="Schválit"
                />
              </>
            )}
            {value === ASSESSMENT_STATUS_APPROVED && (
              <Button
                disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_BEING_EVALUATED)}
                onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
                text="Vrátit ke zpracování"
              />
            )}
          </>
        </Tooltip>
      </>
    );
  }
}
