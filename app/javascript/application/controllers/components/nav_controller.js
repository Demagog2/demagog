import { Controller } from "stimulus"

export default class extends Controller {

  static targets = [ 'link', 'submenu' ]


  toggle(event) {
    event.preventDefault();
    //const = link = this.element.getElementById('myElement');
    if (this.linkTarget.getAttribute('aria-expanded') == "false") {
      this.show();
    } else {
      this.hide(null);
    }
  }

  show() {
    this.linkTarget.setAttribute('aria-expanded', 'true');
    this.linkTarget.classList.add('active');
    this.submenuTarget.classList.add('open');
    this.submenuTarget.setAttribute('aria-open', 'true');
  }

  hide(event) {
    if (event && (this.submenuTarget.contains(event.target) || this.linkTarget.contains(event.target))) {
      return;
    }

    this.linkTarget.setAttribute('aria-expanded', 'false');
    this.linkTarget.classList.remove('active');
    this.submenuTarget.classList.remove('open');
    this.submenuTarget.setAttribute('aria-open', 'false');
  }
}
