import { Controller } from 'stimulus';
import MicroModal from 'micromodal';

export default class extends Controller {
  static targets = ['introVideoModal'];

  showIntroVideoModal(e) {
    MicroModal.show(this.introVideoModalTarget.id, {
      onShow: () => {
        const iframeEl = this.introVideoModalTarget.querySelector('iframe');

        iframeEl.setAttribute('src', iframeEl.dataset.src);
      },
      onClose: () => {
        const iframeEl = this.introVideoModalTarget.querySelector('iframe');

        iframeEl.removeAttribute('src');
      },
    });

    e.stopPropagation();
    e.preventDefault();
  }
}
