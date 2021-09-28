import { Controller } from 'stimulus';
import debounce from 'lodash/debounce';

const ONELINER_HEIGHT = 44;

export default class extends Controller {
  static targets = ['blockquote', 'explanationHtml'];

  connect() {
    this.markOnelinerStatement();

    // Show the full explanation only when short explanation is not present
    if (!this.element.querySelector('.reasons-short')) {
      this.element.classList.remove('collapsed');
    }

    // Open all links from explanation in the new window
    this.explanationHtmlTarget.querySelectorAll('a').forEach((linkElement) => {
      linkElement.setAttribute('target', '_blank');
    });
  }

  handleWindowResize = debounce(this.markOnelinerStatement, 250);

  markOnelinerStatement() {
    this.element.classList.toggle(
      'oneliner-statement',
      this.blockquoteTarget.clientHeight === ONELINER_HEIGHT,
    );
  }

  toggleExplanation(e) {
    this.element.classList.toggle('collapsed');

    e.preventDefault();
    e.stopPropagation();
  }
}
