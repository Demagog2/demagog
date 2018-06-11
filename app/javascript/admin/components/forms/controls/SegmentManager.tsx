import * as React from 'react';
import { v4 as uuid } from 'uuid';

import { Button, Icon, Intent, Menu, MenuItem, Popover, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { SegmentInputType } from '../../../operation-result-types';
import { SelectStatementsModal } from '../../modals/SelectStatementsModal';
import { TextInput } from './TextInput';
import {Statement} from '../../articles/Statement';

type SegmentType = 'text' | 'statements_set';

interface IAddSegmentProps {
  onSelect(type: SegmentType): void;
}

function AddSegment(props: IAddSegmentProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <Popover
        content={
          <Menu>
            <MenuItem text="Textový segment" onClick={() => props.onSelect('text')} />
            <MenuItem text="Výrokový segment" onClick={() => props.onSelect('statements_set')} />
          </Menu>
        }
        position={Position.BOTTOM_RIGHT}
      >
        <Button icon="plus" text="Přidat segment článku" />
      </Popover>
    </div>
  );
}

interface ISegmentProps<T> {
  segment: T;
  onRemove(): void;
  onChange(segment: T): void;
}

class StatementSegment extends React.Component<
  ISegmentProps<IStatementsSegment>,
  { isOpen: boolean }
> {
  public state = {
    isOpen: false,
  };

  public toggleDialog = () => this.setState({ isOpen: !this.state.isOpen });

  public render() {
    return (
      <div>
        {this.props.segment.statements.map((statement) => <Statement id={statement} />)}
        <Button icon="plus" text="Vyberte výroky" onClick={this.toggleDialog} />
        <SelectStatementsModal
          isOpen={this.state.isOpen}
          toggleDialog={this.toggleDialog}
          onSelect={(statements: string[]) => {
            this.props.onChange({
              ...this.props.segment,
              statements,
            });

            this.toggleDialog();
          }}
        />
      </div>
    );
  }
}

function TextSegment(props: ISegmentProps<ITextSegment>) {
  return (
    <div>
      <Icon
        icon={IconNames.TRASH}
        iconSize={Icon.SIZE_LARGE}
        intent={Intent.DANGER}
        onClick={props.onRemove}
      />

      <TextInput
        label="Obsah segmentu:"
        defaultValue={props.segment.text}
        onChange={(evt) =>
          props.onChange({
            ...props.segment,
            text: evt.target.value,
          })
        }
        placeholder="Zadejte obsah segmentu"
      />
    </div>
  );
}

interface IStatementsSegment {
  id: string;
  type: 'statements_set';
  statements: string[];
}

interface ITextSegment {
  id: string;
  type: 'text';
  text: string;
}

type Segment = IStatementsSegment | ITextSegment;

interface ISegmentManagerState {
  segments: Segment[];
}

interface ISegmentManagerProps {
  defaultValue: SegmentInputType[];
  onChange(segments: SegmentInputType[]): void;
}

export class SegmentManager extends React.Component<ISegmentManagerProps, ISegmentManagerState> {
  constructor(props: ISegmentManagerProps) {
    super(props);

    this.state = {
      segments: props.defaultValue.map(
        (segInput): Segment => {
          if (segInput.segment_type === 'text') {
            return {
              id: segInput.id || uuid(),
              text: segInput.text || '',
              type: 'text',
            };
          }

          return {
            id: segInput.id || uuid(),
            type: 'statements_set',
            statements: [],
          };
        },
      ),
    };
  }

  public addSegment = (segmentType: SegmentType): void => {
    const segments = this.state.segments;

    const segment =
      segmentType === 'text'
        ? { id: uuid(), type: segmentType, text: '' }
        : { id: uuid(), type: segmentType, statements: [] };

    this.updateSegments([...segments, segment]);
  };

  public removeSegment = (id: string) => () => {
    const segments = this.state.segments.filter((segment) => segment.id !== id);

    this.updateSegments(segments);
  };

  public updateSegment = (id: string) => (newSegment: Segment) => {
    const segments = this.state.segments.map((segment) => {
      return segment.id === id ? newSegment : segment;
    });

    this.updateSegments(segments);
  };

  public render() {
    return (
      <div>
        {this.state.segments.map((segment) => {
          if (segment.type === 'text') {
            return (
              <TextSegment
                segment={segment}
                onRemove={this.removeSegment(segment.id)}
                onChange={this.updateSegment(segment.id)}
              />
            );
          }

          return (
            <StatementSegment
              key={segment.id}
              segment={segment}
              onRemove={this.removeSegment(segment.id)}
              onChange={this.updateSegment(segment.id)}
            />
          );
        })}

        <AddSegment onSelect={this.addSegment} />
      </div>
    );
  }

  private updateSegments(segments: Segment[]) {
    this.setState({ segments }, () => {
      this.props.onChange(segments.map(mapSegmentToSegmentInputType));
    });
  }
}

function mapSegmentToSegmentInputType(segment: Segment): SegmentInputType {
  if (segment.type === 'text') {
    return {
      id: segment.id,
      segment_type: segment.type,
      text: segment.text,
    };
  }

  return {
    id: segment.id,
    segment_type: segment.type,
    statements: segment.statements,
  };
}
