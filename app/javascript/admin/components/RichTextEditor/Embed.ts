import { IconSvgPaths20 } from '@blueprintjs/icons';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import '@ckeditor/ckeditor5-media-embed/theme/mediaembed.css';
import { injectGlobal } from 'emotion';

export default class Embed extends Plugin {
  public editor;

  public init() {
    const editor = this.editor;
    const schema = editor.model.schema;
    const conversion = editor.conversion;
    const domConverter = editor.editing.view.domConverter;

    // Configure the schema.
    schema.register('embed', {
      isObject: true,
      isBlock: true,
      allowWhere: '$block',
      allowAttributes: ['code'],
    });

    // Model -> Data
    conversion.for('dataDowncast').elementToElement({
      model: 'embed',
      view: (modelElement, viewWriter) => {
        const code = modelElement.getAttribute('code');

        return viewWriter.createUIElement('figure', { class: 'embed' }, function(domDocument) {
          const domElement = this.toDomElement(domDocument);

          domElement.innerHTML = code;

          return domElement;
        });
      },
    });

    // Model -> View
    conversion.for('editingDowncast').elementToElement({
      model: 'embed',
      view: (modelElement, viewWriter) => {
        const code = modelElement.getAttribute('code');

        const iframeWrapperElement = viewWriter.createRawElement(
          'div',
          {
            class: 'ck-media__wrapper',
          },
          (domElement) => {
            domElement.innerHTML = code;
          },
        );

        const figureElement = viewWriter.createContainerElement('figure', { class: 'media' });

        viewWriter.insert(viewWriter.createPositionAt(figureElement, 0), iframeWrapperElement);

        return toWidget(figureElement, viewWriter, { label: 'embed widget' });
      },
    });

    // View -> Model
    conversion
      .for('upcast')
      // figure.embed (Preferred way to represent embed)
      .elementToElement({
        view: {
          name: 'figure',
          attributes: {
            class: 'embed',
          },
        },
        model: (viewFigure, modelWriter) => {
          const figureEl = domConverter.viewToDom(viewFigure, window.document);
          const code = figureEl.innerHTML;

          return modelWriter.createElement('embed', { code });
        },
      })
      // iframe (To be able to parse older representation)
      .elementToElement({
        view: {
          name: 'iframe',
        },
        model: (viewIframe, modelWriter) => {
          const iframeEl = domConverter.viewToDom(viewIframe, window.document);
          const code = iframeEl.outerHTML;

          return modelWriter.createElement('embed', { code });
        },
      })
      // div.infogram-embed (To be able to parse older representation)
      .elementToElement({
        view: {
          name: 'div',
        },
        model: (viewIframe, modelWriter) => {
          const divEl = domConverter.viewToDom(viewIframe, window.document);

          if (divEl.querySelector('.infogram-embed')) {
            const code = divEl.outerHTML;

            return modelWriter.createElement('embed', { code });
          }
        },
      });

    editor.ui.componentFactory.add('embed', (locale) => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert embed',
        icon: codeIcon,
        tooltip: true,
      });

      // Callback executed once the toolbar item is clicked.
      view.on('execute', () => {
        const code = prompt('Vložte embedovaný kód (začíná většinou znaky "<iframe "):');

        if (code === null || code.trim() === '') {
          // Prompt cancelled or nothing put in
          return;
        }

        editor.model.change((writer) => {
          const embedElement = writer.createElement('embed', {
            code,
          });

          // Insert the embed in the current selection location.
          editor.model.insertContent(embedElement, editor.model.document.selection);
        });
      });

      return view;
    });
  }
}

const codeIcon =
  '' +
  '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
  '<path fill-rule="evenodd" d="' +
  IconSvgPaths20.code +
  '" />' +
  '</svg>';

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  /* Allow interaction in the embed only when the embed is selected */
  .ck-editor__editable:not(.ck-read-only) .ck-widget:not(.ck-widget_selected) .ck-media__wrapper > * {
    pointer-events: none;
  }
`;
