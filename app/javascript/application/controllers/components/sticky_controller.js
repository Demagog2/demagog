import { Controller } from "stimulus"

export default class extends Controller {

  static targets = [ 'sticky', 'content' ]

  initialize() {
    this.breakpoint = this.data.get('breakpoint');
  }

  onScroll(event) {
    if (this.stickyTarget && this.contentTarget) {


      if(window.innerWidth > this.breakpoint){
        const sH = this.stickyTarget.getBoundingClientRect().height;
        const sW = this.stickyTarget.getBoundingClientRect().width;
        const cH = this.contentTarget.getBoundingClientRect().height;
        const cW = this.contentTarget.getBoundingClientRect().width;

        this.sticked(sW, sH, cW, cH);
      } else {
        if (this.stickyTarget.getAttribute('style')) {
          this.stickyTarget.removeAttribute('style')
        }
        if (this.stickyTarget.classList.contains("position-absolute")) {
          this.stickyTarget.classList.remove("position-absolute");
        }
      }
    }

  }

  sticked(sW, sH, cW, cH) {
    const dis = 80;
    const offset = this.contentTarget.offsetTop;
    const sT = window.scrollY;
    const eT = (this.contentTarget.getBoundingClientRect().top * -1) + dis;
    const width = this.stickyTarget.parentNode.offsetWidth;

    if (eT > 0) {
      const max = cH - sH;
      if (eT <= max) {
        this.stickyTarget.setAttribute("style", "top: " + dis + "px; widht:" + width +"px;")
        if (this.stickyTarget.classList.contains("position-absolute")) {
          this.stickyTarget.classList.remove("position-absolute");
        }
        if (! this.stickyTarget.classList.contains("position-fixed")) {
          this.stickyTarget.classList.add("position-fixed");
        }
      } else {
        if (this.stickyTarget.classList.contains("position-fixed")) {
          this.stickyTarget.classList.remove("position-fixed");
        }
        if (! this.stickyTarget.classList.contains("position-absolute")) {
          this.stickyTarget.classList.add("position-absolute");
        }
        this.stickyTarget.setAttribute("style", "top: " + max + "px; widht:" + width +"px;")
      }

    } else {
      if (this.stickyTarget.classList.contains("position-absolute")) {
        this.stickyTarget.classList.remove("position-absolute");
      }
      if (this.stickyTarget.classList.contains("position-fixed")) {
        this.stickyTarget.classList.remove("position-fixed");
      }
      if (this.stickyTarget.getAttribute('style')) {
        this.stickyTarget.removeAttribute('style')
      }
    }
  }
}
