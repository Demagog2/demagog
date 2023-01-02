import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = ['link', 'nav', 'menu', 'donateModal']

  connect() {
    //window.addEventListener("scroll", this.onScroll);
    this.offset = 100;
    this.lastScrollTop = 0;
  }

  disconnect() {
    //window.removeEventListener("scroll", this.onScroll);
  }

  onScroll(event) {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.getElementById("header")

    if (st > 100) {
      if (! this.element.classList.contains("on-scroll")) {
        this.element.classList.add("on-scroll");
      }
    } else {
      if (this.element.classList.contains("on-scroll")) {
        this.element.classList.remove("on-scroll");
      }
    }

    if (st > this.lastScrollTop){
      if (! this.element.classList.contains("hide-header")) {
        this.element.classList.add("hide-header")
        if (this.menuTarget.getAttribute('aria-expanded') == "true") {
          this.menuTarget.classList.remove('open');
          this.navTarget.classList.remove('open');
          this.menuTarget.setAttribute('aria-expanded', 'false');
        }
        const navItems = header.querySelectorAll("[aria-expanded='true']");
        const navDrops = header.querySelectorAll("[aria-open='true']");
        if (navItems.length) {
          navItems.forEach((item) => {
            item.setAttribute('aria-expanded', 'false');
            item.classList.remove('active');
          });
        }
        if (navDrops.length)  {
          navDrops.forEach((item) => {
            item.setAttribute('aria-open', 'false');
            item.classList.remove('open');
          });
        }


      }
    } else {
      if (this.element.classList.contains("hide-header")) {
        this.element.classList.remove("hide-header")

      }
    }

    this.lastScrollTop = st <= 0 ? 0 : st;

  }

  toggleMenu(){
    if (this.menuTarget.getAttribute('aria-expanded') == "false") {
      this.menuTarget.classList.add('open');
      this.navTarget.classList.add('open');
      this.menuTarget.setAttribute('aria-expanded', 'true');
    } else {
      this.menuTarget.classList.remove('open');
      this.navTarget.classList.remove('open');
      this.menuTarget.setAttribute('aria-expanded', 'false');
    }
  }

  toggleDonate() {
    if (this.donateModalTarget.getAttribute('aria-modal-open') == "false") {
      this.donateModalTarget.classList.add('is-open');
      this.donateModalTarget.setAttribute('aria-expanded', 'true');
    } else {
      this.donateModalTarget.classList.remove('is-open');
      this.donateModalTarget.setAttribute('aria-expanded', 'false');
    }
  }
}
