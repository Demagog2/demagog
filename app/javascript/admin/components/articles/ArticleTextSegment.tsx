import * as React from 'react';

import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

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
        html={props.segment.text_html}
        onChange={(html) => {
          props.onChange({
            ...props.segment,
            text_html: html,
            text_slatejson: null,
          });
        }}
      />
    </div>
  );
}
