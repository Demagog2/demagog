import { Controller } from 'stimulus';
import debounce from 'lodash/debounce';

export default class extends Controller {
  static targets = ['link'];

  initialize() {
    this.sendDocumentHeight();
  }

  handleWindowResize = debounce(this.sendDocumentHeight, 250);

  sendDocumentHeight() {
    const message = {
      type: 'documentHeight',
      payload: document.body.offsetHeight,
    };

    window.parent.postMessage(message, '*');
  }

  containerClick() {
    if (this.data.get('display') === 'short') {
      const url = this.linkTarget.getAttribute('href');
      window.open(url, '_blank');
    }
  }
}
