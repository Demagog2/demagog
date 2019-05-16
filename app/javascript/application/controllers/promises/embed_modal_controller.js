import { Controller } from 'stimulus';
import MicroModal from 'micromodal';

export default class extends Controller {
  static targets = ['modal', 'code', 'previewContainer'];

  showModal(e) {
    const id = e.currentTarget.dataset.statementId;

    MicroModal.show(this.modalTarget.id);

    const origin = `${window.location.protocol}//${window.location.host}`;
    const url = `${origin}/sliby/druha-vlada-andreje-babise/embed/${id}`;
    const src = `${origin}/packs/widget.js`;

    let code = `<demagogcz-widget data-url="${url}"></demagogcz-widget>\n`;
    code += `<script src="${src}" type="text/javascript"></script>`;

    this.codeTarget.value = code;
    this.previewContainerTarget.innerHTML = `<demagogcz-widget data-url="${url}"></demagogcz-widget>`;

    window.__demagogczInitializeWidgets__();

    e.stopPropagation();
    e.preventDefault();
  }
}
