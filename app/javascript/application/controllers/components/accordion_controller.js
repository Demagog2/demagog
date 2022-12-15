import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = [ 'link', 'content', 'label']

  connect() {
    if (this.linkTarget.getAttribute('aria-show') == "false") {
      this.hide();
    } else {
      this.linkTarget.classList.add('open');
      this.contentTarget.style.maxHeight = this.contentTarget.scrollHeight + "px";
    }
  }

  toggle(event) {
    event.preventDefault();
    if (this.linkTarget.getAttribute('aria-show') == "false") {
      this.show();
    } else {
      this.hide();
    }
  }

  checkHeight(event) {
    event.preventDefault();
    if (this.linkTarget.getAttribute('aria-show') == "true") {
    }
  }

  hide() {
    this.linkTarget.setAttribute('aria-show', 'false');
    this.linkTarget.classList.remove('open');
    this.contentTarget.classList.add('close');
    this.contentTarget.style.maxHeight = 0;
    if (this.data.get('openLabel') && this.data.get('closeLabel') && this.labelTarget) {
      this.labelTarget.innerHTML = this.data.get('closeLabel');
    }
  }

  show() {
    this.linkTarget.setAttribute('aria-show', 'true');
    this.linkTarget.classList.add('open');
    this.contentTarget.classList.remove('close');
    this.contentTarget.style.maxHeight = this.contentTarget.scrollHeight + "px";
    if (this.data.get('openLabel') && this.data.get('closeLabel') && this.labelTarget) {
      this.labelTarget.innerHTML = this.data.get('openLabel');
    }
  }
}
