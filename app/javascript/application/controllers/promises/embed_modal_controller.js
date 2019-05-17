import { Controller } from 'stimulus';
import MicroModal from 'micromodal';

export default class extends Controller {
  static targets = ['modal', 'code', 'previewContainer', 'displayFullButton', 'displayShortButton'];

  showModal(e) {
    this.data.set('display', 'full');
    this.data.set('statementId', e.currentTarget.dataset.statementId);

    MicroModal.show(this.modalTarget.id);

    this.propagateActiveDisplayButton();
    this.showCodeAndPreview();

    e.stopPropagation();
    e.preventDefault();
  }

  setDisplayFull() {
    this.data.set('display', 'full');
    this.propagateActiveDisplayButton();
    this.showCodeAndPreview();
  }

  setDisplayShort() {
    this.data.set('display', 'short');
    this.propagateActiveDisplayButton();
    this.showCodeAndPreview();
  }

  showCodeAndPreview() {
    const statementId = this.data.get('statementId');
    const origin = `${window.location.protocol}//${window.location.host}`;

    let url = `${origin}/sliby/druha-vlada-andreje-babise/embed/${statementId}`;
    if (this.data.get('display') === 'short') {
      url += '?display=short';
    }

    const src = `${origin}/packs/widget.js`;

    let code = `<demagogcz-widget data-url="${url}"></demagogcz-widget>`;
    code += `<script src="${src}" type="text/javascript"></script>`;

    this.codeTarget.value = code;
    this.previewContainerTarget.innerHTML = `<demagogcz-widget data-url="${url}"></demagogcz-widget>`;

    window.__demagogczInitializeWidgets__();
  }

  propagateActiveDisplayButton() {
    const display = this.data.get('display');
    this.displayFullButtonTarget.classList.toggle('active', display === 'full');
    this.displayShortButtonTarget.classList.toggle('active', display === 'short');
  }
}
