import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class InsertImageViaUrl extends Plugin {
  public editor;

  public init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertImageViaUrl', (locale) => {
      const view = new ButtonView(locale);
      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true,
      });

      // Callback executed once the toolbar item is clicked.
      view.on('execute', () => {
        const imageUrl = prompt('Vložte URL obrázku:');

        editor.model.change((writer) => {
          const imageElement = writer.createElement('image', {
            src: imageUrl,
          });

          // Insert the image in the current selection location.
          editor.model.insertContent(imageElement, editor.model.document.selection);
        });
      });

      return view;
    });
  }
}
