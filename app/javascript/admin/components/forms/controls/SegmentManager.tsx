import * as React from 'react';

import { Button, Callout, Intent, Menu, MenuItem, Popover, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { v4 as uuid } from 'uuid';

import { SegmentInputType } from '../../../operation-result-types';
import { Statement } from '../../articles/Statement';
import { SelectStatementsModal } from '../../modals/SelectStatementsModal';
import RichTextEditor from '../../RichTextEditor';

type SegmentType = 'text' | 'statements_set';

interface IAddSegmentProps {
  onSelect(type: SegmentType): void;
}

function RemoveSegment(props: { onRemove(): void }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 2,
        left: -45,
      }}
    >
      <Button icon={IconNames.TRASH} onClick={props.onRemove} title="Odstranit segment" />
    </div>
  );
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
        minimal
      >
        <Button icon={IconNames.PLUS} text="Přidat segment článku…" />
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
  constructor(props) {
    super(props);

    this.state = {
      isOpen: this.props.segment.statements.length === 0,
    };
  }

  public toggleDialog = () => this.setState({ isOpen: !this.state.isOpen });

  public render() {
    return (
      <div style={{ marginBottom: 20, position: 'relative' }}>
        <RemoveSegment onRemove={this.props.onRemove} />

        {this.props.segment.statements.length > 0 && (
          <>
            <h2
              style={{
                fontFamily: 'Lato, sans-serif',
                color: '#3c325c',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.5px',
                margin: '20px 0 10px 0',
              }}
            >
              Výroky
            </h2>

            {this.props.segment.statements.map((statement) => (
              <Statement key={statement} id={statement} />
            ))}
          </>
        )}

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
    <div style={{ marginBottom: 20, position: 'relative' }}>
      <RemoveSegment onRemove={props.onRemove} />

      {props.segment.text_html && !props.segment.text_slatejson ? (
        <div>
          <Callout intent={Intent.PRIMARY} icon={IconNames.INFO_SIGN} style={{ marginBottom: 10 }}>
            Tento textový segment je ze staré administrace a pokud jej chcete změnit, musíte jej
            smazat a vytvořit textový segment nový.
          </Callout>

          <div dangerouslySetInnerHTML={{ __html: props.segment.text_html }} />
        </div>
      ) : (
        <RichTextEditor
          value={props.segment.text_slatejson}
          onChange={(json, html) => {
            props.onChange({
              ...props.segment,
              text_html: html,
              text_slatejson: json,
            });
          }}
          contentsStyle={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '16px',
            lineHeight: '25.6px',
            letterSpacing: '0.4px',
          }}
        />
      )}
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
  text_html: string;
  text_slatejson: GraphQLCustomScalar_JSON | null;
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
              text_html: segInput.text_html || '',
              text_slatejson: segInput.text_slatejson || null,
              type: 'text',
            };
          }

          return {
            id: segInput.id || uuid(),
            type: 'statements_set',
            statements: segInput.statements || [],
          };
        },
      ),
    };
  }

  public addSegment = (segmentType: SegmentType, addToIndex?: number): void => {
    const segments = this.state.segments;

    const segment =
      segmentType === 'text'
        ? { id: uuid(), type: segmentType, text_html: '', text_slatejson: null }
        : { id: uuid(), type: segmentType, statements: [] };

    const newSegments = [...segments];
    if (addToIndex !== undefined) {
      newSegments.splice(addToIndex, 0, segment);
    } else {
      newSegments.push(segment);
    }

    this.updateSegments(newSegments);
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
        {this.state.segments.map((segment, segmentIndex) => (
          <React.Fragment key={segment.id}>
            <AddSegment onSelect={(segmentType) => this.addSegment(segmentType, segmentIndex)} />

            {segment.type === 'text' ? (
              <TextSegment
                segment={segment}
                onRemove={this.removeSegment(segment.id)}
                onChange={this.updateSegment(segment.id)}
              />
            ) : (
              <StatementSegment
                segment={segment}
                onRemove={this.removeSegment(segment.id)}
                onChange={this.updateSegment(segment.id)}
              />
            )}
          </React.Fragment>
        ))}

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
      text_html: segment.text_html,
      text_slatejson: segment.text_slatejson,
    };
  }

  return {
    id: segment.id,
    segment_type: segment.type,
    statements: segment.statements,
  };
}
