import { Controller } from 'stimulus';
import debounce from 'lodash/debounce';

const ONELINER_HEIGHT = 63;

export default class extends Controller {
  static targets = ['blockquote', 'explanationHtml'];

  connect() {
    this.markOnelinerStatement();

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
}
