import * as React from 'react';

import bodyLogoPlaceholder from 'images/admin/body_logo_placeholder.png';

// TODO: do not use image from legacy demagog
// const EMPTY_LOGO_IMAGE_SRC = 'http://legacy.demagog.cz/data/users/default.png';

interface IBodyLogoProps {
  logo: string | null;
  name?: string;
}

export default function BodyLogo(props: IBodyLogoProps) {
  const src = props.logo || bodyLogoPlaceholder;
  const alt = props.name || '';

  return (
    <div style={{ maxWidth: 106 }}>
      <img src={src} alt={alt} className="img-thumbnail" />
    </div>
  );
}
