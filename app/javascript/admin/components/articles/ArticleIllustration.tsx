import * as React from 'react';

import { Colors } from '@blueprintjs/core';

import bodyLogoPlaceholder from 'admin/images/body_logo_placeholder.png';

interface IArticleIllustrationProps {
  illustration: string | null;
  title: string;
  onClick?(): void;
}

export default function ArticleIllustration(props: IArticleIllustrationProps) {
  const src = props.illustration || bodyLogoPlaceholder;

  return (
    <div style={{ maxWidth: 106 }}>
      <img
        src={src}
        alt={props.title}
        onClick={props.onClick}
        style={{
          padding: 4,
          border: `1px solid ${Colors.GRAY5}`,
          borderRadius: 4,
          maxWidth: '100%',
          height: 'auto',
          cursor: props.onClick ? 'pointer' : 'default',
        }}
      />
    </div>
  );
}
