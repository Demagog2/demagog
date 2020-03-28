import * as React from 'react';

import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { css } from 'emotion';

import RichTextEditor from '../RichTextEditor';

interface ITextSegment {
  id: string | undefined | null;
  segment_type: string;
  text_html: string | null;
  text_slatejson: GraphQLCustomScalar_Json | null;
}

interface IProps {
  segment: ITextSegment;
  onRemove(): void;
  onChange(segment: ITextSegment): void;
}

export default function ArticleTextSegment(props: IProps) {
  return (
    <div style={{ marginBottom: 20, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: -45,
        }}
      >
        <Button icon={IconNames.TRASH} onClick={props.onRemove} title="Odstranit segment" />
      </div>

      <RichTextEditor
        value={props.segment.text_slatejson}
        html={props.segment.text_html}
        onChange={(json, html) => {
          props.onChange({
            ...props.segment,
            text_html: html,
            text_slatejson: json,
          });
        }}
        className={css`
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 25.6px;
          letter-spacing: 0.4px;

          h2 {
            margin: 15px 0 8px 0;
            font-size: 18px;
            font-weight: 700px;
          }
        `}
      />
    </div>
  );
}
