import * as React from 'react';

import { injectGlobal } from 'emotion';
import debounce from 'lodash/debounce';

import CKEditor from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';

import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';

import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';

import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';

// import Table from '@ckeditor/ckeditor5-table/src/table';
// import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';

import Embed from './Embed';
import InsertImageViaUrl from './InsertImageViaUrl';

const ExplanationEditor = ({
  html,
  onChange,
}: {
  html: string | null;
  onChange: (html: string) => void;
}) => {
  const [data, setData] = React.useState(html);
  const [isEditing, setIsEditing] = React.useState(false);

  const stoppedEditing = React.useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const debouncedOnChange = React.useMemo(() => debounce(onChange, 200), [onChange]);
  const debouncedStoppedEditing = React.useMemo(() => debounce(stoppedEditing, 15000), [
    stoppedEditing,
  ]);

  React.useEffect(() => {
    if (!isEditing) {
      setData(html);
    }
  }, [html, isEditing]);

  const onCKEditorChange = React.useCallback(
    (_0, editor) => {
      setIsEditing(true);
      debouncedStoppedEditing();
      debouncedOnChange(editor.getData());
    },
    [setIsEditing, debouncedOnChange],
  );

  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfiguration}
      data={data}
      onChange={onCKEditorChange}
    />
  );
};

export default ExplanationEditor;

const editorConfiguration = {
  plugins: [
    Essentials,
    Autoformat,

    Bold,
    Italic,
    Strikethrough,
    Paragraph,
    Link,
    List,

    Image,
    ImageCaption,
    InsertImageViaUrl,

    Embed,

    TextTransformation,

    SpecialCharacters,
    SpecialCharactersEssentials,
    SpecialCharactersSpaces,

    PasteFromOffice,

    NonBreakableSpaceKeystrokes,

    // Table,
    // TableToolbar,
  ],
  toolbar: {
    viewportTopOffset: 50, // because navbar
    items: [
      'bold',
      'italic',
      'strikethrough',
      '|',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      // '|',
      // 'insertTable',
      '|',
      'insertImageViaUrl',
      'embed',
      '|',
      'specialCharacters',
      '|',
      'undo',
      'redo',
    ],
  },
  image: {
    toolbar: [],
  },
  typing: {
    transformations: {
      remove: [
        // Do not use the US quotes
        'quotes',
      ],
      extra: [
        // Czech double quotes
        {
          from: buildQuotesRegExp('"'),
          to: [null, '„', null, '“'],
        },
        // Czech single quotes
        {
          from: buildQuotesRegExp("'"), // tslint:disable-line:quotemark
          to: [null, '‚', null, '‘'],
        },
      ],
    },
  },
  // table: {
  //   contentToolbar: ['tableColumn', 'tableRow'],
  // },
};

// tslint:disable-next-line:max-line-length
// From https://github.com/ckeditor/ckeditor5-typing/blob/cd4fa3ea2dcd5789e91fae92d7f220ef850cc7b6/src/texttransformation.js
function buildQuotesRegExp(quoteCharacter) {
  return new RegExp(`(^|\\s)(${quoteCharacter})([^${quoteCharacter}]*)(${quoteCharacter})$`);
}

function SpecialCharactersSpaces(editor) {
  editor.plugins
    .get('SpecialCharacters')
    .addItems('Spaces', [{ title: 'non-breakable space', character: '\u00a0' }]);
}

function NonBreakableSpaceKeystrokes(editor) {
  // Mac non-breakable space hack, see https://github.com/ckeditor/ckeditor5/issues/1669#issuecomment-478934583
  editor.keystrokes.set('Alt+space', (_0, stop) => {
    editor.execute('input', { text: '\u00a0' });
    stop();
  });
  // TODO: Add also for alt+0160 on Windows
}

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  .ck-content .image {
    margin-left: 0;
  }

  .ck-content .table {
    margin-left: 0;
  }
`;
