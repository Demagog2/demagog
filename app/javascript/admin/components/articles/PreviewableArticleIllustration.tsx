import React, { useState } from 'react';

import { Dialog } from '@blueprintjs/core';

import bodyLogoPlaceholder from 'admin/images/body_logo_placeholder.png';
import ArticleIllustration from './ArticleIllustration';

const PREVIEW_WIDTH_SIZE = '80vw';

interface IArticleIllustrationProps {
  illustration: string | null;
  title: string;
}

export default function PreviewableArticleIllustration(props: IArticleIllustrationProps) {
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Dialog
        title={props.title}
        isOpen={isPreviewOpen}
        onClose={() => { setPreviewOpen(false); }}
        isCloseButtonShown
        style={{ width: PREVIEW_WIDTH_SIZE }}
      >
        <img
          src={props.illustration || bodyLogoPlaceholder}
          alt={props.title}
          style={{ maxWidth: PREVIEW_WIDTH_SIZE }}
        />
      </Dialog>

      <ArticleIllustration {...props} onClick={() => { setPreviewOpen(true); }} />
    </>
  );
}
