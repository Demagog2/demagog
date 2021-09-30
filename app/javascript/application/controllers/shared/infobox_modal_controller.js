import { Controller } from 'stimulus';
import MicroModal from 'micromodal';

export default class extends Controller {
  static targets = ['modal'];

  showModal(e) {
    MicroModal.show(this.modalTarget.id);

    e.stopPropagation();
    e.preventDefault();
  }
}
