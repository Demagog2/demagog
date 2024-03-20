import { Controller } from 'stimulus';
import MicroModal from 'micromodal';

export default class extends Controller {
  static targets = ['modal'];

  openModal() {
    MicroModal.show(this.modalTarget.id, {
      onShow: () => {
        const iframeEl = this.modalTarget.querySelector('iframe');

        iframeEl.setAttribute('src', iframeEl.dataset.src);
      },
      onClose: () => {
        const iframeEl = this.modalTarget.querySelector('iframe');

        iframeEl.removeAttribute('src');
      },
    });
  }
}
