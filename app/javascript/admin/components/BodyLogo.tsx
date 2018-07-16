import * as React from 'react';

import { Colors } from '@blueprintjs/core';

import bodyLogoPlaceholder from 'admin/images/body_logo_placeholder.png';

interface IBodyLogoProps {
  logo: string | null;
  name?: string;
}

export default function BodyLogo(props: IBodyLogoProps) {
  const src = props.logo || bodyLogoPlaceholder;
  const alt = props.name || '';

  return (
    <div style={{ maxWidth: 106 }}>
      <img
        src={src}
        alt={alt}
        style={{
          padding: 4,
          border: `1px solid ${Colors.GRAY5}`,
          borderRadius: 4,
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
}
