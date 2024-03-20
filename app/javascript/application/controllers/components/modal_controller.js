import { Controller } from 'stimulus';
import MicroModal from 'micromodal';

export default class extends Controller {
  static targets = ['introVideoModal', 'modal'];
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

  initialize() {
    this.setUpModal();
  }

  setUpModal() {
    const modalId = this.modalId;
    if (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('is-open');
      }
    }
  }

  openModal(e) {
    const { modalId } = e.currentTarget.dataset;
    this.modalId = modalId;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-open');
    }
  }

  closeModal(e) {
    this.modalId = null;
    this.modalTarget.classList.remove('is-open');
  }

  get modalId() {
    const match = window.location.hash;
    return match ? match.replace(/#/, '') : null;
  }

  set modalId(id) {
    const anchor = id !== null ? `#${id}` : '';

    window.history.pushState(
      undefined,
      undefined,
      window.location.pathname + window.location.search + anchor,
    );
  }
}
