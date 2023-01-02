import { Controller } from "stimulus"

export default class extends Controller {

  static targets = ['link', 'expander', 'label']

  initialize() {
    this.wW = null;
    this.breakpoint = this.data.get('breakpoint');
    this.minHeight = this.data.get('minHeight');
    this.isBreak = false;
    if (!this.minHeight) {
      this.minHeight = "100px";
    }
    this.layout();
  }

  hide() {
    console.log("hide");
    if (this.expanderTarget.getAttribute('aria-small') == "true") {
      this.expanderTarget.setAttribute('aria-small', 'false');
    }
    if (this.linkTarget.classList.contains("hide")) {
      this.linkTarget.classList.remove("hide");
    }

    if (!this.expanderTarget.classList.contains("is-hide")) {
      this.expanderTarget.classList.add("is-hide");
    }

    if (this.expanderTarget.style.maxHeight != this.minHeight) {
      this.expanderTarget.style.maxHeight = this.minHeight;
    }

  }

  show() {
    if (this.expanderTarget.getAttribute('aria-small') == "false") {
      this.expanderTarget.setAttribute('aria-small', 'true');
    }
    if (!this.linkTarget.classList.contains("hide")) {
      this.linkTarget.classList.add("hide");
    }

    if (this.expanderTarget.classList.contains("is-hide")) {
      this.expanderTarget.classList.remove("is-hide");
    }

    if (this.isBreak) {
      this.expanderTarget.style.maxHeight = this.expanderTarget.scrollHeight + 'px';
    } else {
      this.expanderTarget.style.maxHeight = null;
    }

  }

  toggle(e) {

    if (this.expanderTarget.getAttribute('aria-small') == "true") {
      this.expanderTarget.setAttribute('aria-small', 'false');
      this.expanderTarget.style.maxHeight = this.minHeight;

      if (!this.expanderTarget.classList.contains("is-hide")) {
        this.expanderTarget.classList.add("is-hide");
      }

      if (this.data.get('openLabel') && this.data.get('closeLabel') && this.labelTarget) {
        this.labelTarget.innerHTML = this.data.get('closeLabel');
      }
    }else{
      this.expanderTarget.setAttribute('aria-small', 'true');
      this.expanderTarget.style.maxHeight = this.expanderTarget.scrollHeight + 'px';

      if (this.expanderTarget.classList.contains("is-hide")) {
        this.expanderTarget.classList.remove("is-hide");
      }

      if (this.data.get('openLabel') && this.data.get('closeLabel') && this.labelTarget) {
        this.labelTarget.innerHTML = this.data.get('openLabel');
      }
    }
    e.stopPropagation();
    e.preventDefault();
  }

  layout() {
    if (window.innerWidth > this.breakpoint) {
      this.wW = window.innerWidth;
      this.isBreak = false;
      this.show();

    } else {
      if (this.wW != window.innerWidth) {
        this.wW = window.innerWidth;
        this.isBreak = true;
        this.hide();
      }
    }

  }


}
