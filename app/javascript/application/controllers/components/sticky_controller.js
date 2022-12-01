import { Controller } from "stimulus"

export default class extends Controller {

  static targets = [ 'sticky', 'content' ]

  onScroll(event) {
    if (this.stickyTarget && this.contentTarget) {
      const sH = this.stickyTarget.getBoundingClientRect().height;
      const sW = this.stickyTarget.getBoundingClientRect().width;
      const cH = this.contentTarget.getBoundingClientRect().height;
      const cW = this.contentTarget.getBoundingClientRect().width;

      if(cH > sH && sW < cW){
        this.sticked(sW, sH, cW, cH);
      } else {
        if (this.stickyTarget.getAttribute('style')) {
          this.stickyTarget.removeAttribute('style')
        }
      }
    }

  }

  sticked(sW, sH, cW, cH) {
    const dis = 40;
    const offset = this.contentTarget.offsetTop;
    const sT = window.scrollY;
    const eT = (this.element.getBoundingClientRect().top * -1) + offset;

    if (eT > 0) {
      const max = cH - sH;
      if (eT <= max) {
        this.stickyTarget.setAttribute("style", "top: " + eT +"px; position: absolute;")
      } else {
        this.stickyTarget.setAttribute("style", "top: " + max +"px; position: absolute;")
      }

    } else {
      if (this.stickyTarget.getAttribute('style')) {
        this.stickyTarget.removeAttribute('style')
      }
    }
  }
}
