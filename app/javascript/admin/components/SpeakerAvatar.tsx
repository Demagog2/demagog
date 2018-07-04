import * as React from 'react';

import { Colors } from '@blueprintjs/core';

// TODO: do not use image from legacy demagog
const EMPTY_AVATAR_IMAGE_SRC = 'http://legacy.demagog.cz/data/users/default.png';

interface ISpeakerAvatarProps {
  avatar: string | null;
  first_name?: string;
  last_name?: string;
}

export default function SpeakerAvatar(props: ISpeakerAvatarProps) {
  const src = props.avatar !== null ? props.avatar : EMPTY_AVATAR_IMAGE_SRC;
  const alt = (props.first_name || '') + ' ' + (props.last_name || '');

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
