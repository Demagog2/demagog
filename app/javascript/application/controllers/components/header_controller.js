import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = ['link', 'nav']

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

    if (st > this.lastScrollTop){
      if (! this.element.classList.contains("hide-header")) {
        this.element.classList.add("hide-header")
        const navItems = document.querySelectorAll("[aria-expanded='true']");
        const navDrops = document.querySelectorAll("[aria-open='true']");
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
        if (this.linkTarget.getAttribute('aria-expanded') == "true") {
          this.linkTarget.classList.remove('open');
          this.navTarget.classList.remove('open');
          this.linkTarget.setAttribute('aria-expanded', 'false');
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
    if (this.linkTarget.getAttribute('aria-expanded') == "false") {
      this.linkTarget.classList.add('open');
      this.navTarget.classList.add('open');
      this.linkTarget.setAttribute('aria-expanded', 'true');
    } else {
      this.linkTarget.classList.remove('open');
      this.navTarget.classList.remove('open');
      this.linkTarget.setAttribute('aria-expanded', 'false');
    }
  }
}
