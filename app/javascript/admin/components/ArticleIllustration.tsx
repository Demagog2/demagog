import * as React from 'react';

import bodyLogoPlaceholder from 'images/admin/body_logo_placeholder.png';

interface IArticleIllustrationProps {
  illustration: string | null;
  title: string;
}

export default function ArticleIllustration(props: IArticleIllustrationProps) {
  const src = props.illustration || bodyLogoPlaceholder;

  return (
    <div style={{ maxWidth: 106 }}>
      <img src={src} alt={props.title} className="img-thumbnail" />
    </div>
  );
}
