import { Controller } from "stimulus"
import * as queryString from 'query-string';
import debounce from 'lodash/debounce';

export default class extends Controller {

  static targets = ['item'];

  initialize() {
    this.setUpItems()
  }

  setUpItems() {
    this.itemTargets.forEach((el) => {
      const content = el.querySelector(".accordion-content");
      const detail = el.querySelector(".accordion-detail");
      const label = el.querySelector(".accordion-label");
      if (content) {
        if (content.getAttribute('aria-show') == "false") {
          content.style.maxHeight = 0 + "px";
          if (this.data.get('closePreviewLabel')) {
            label.innerHTML = this.data.get('closePreviewLabel');
          }

        } else {
          content.style.maxHeight = content.scrollHeight + "px";
          if (this.data.get('openPreviewLabel')) {
            label.innerHTML = this.data.get('openPreviewLabel');
          }
        }
      }

      if (detail) {
        if (detail.getAttribute('aria-show') == "false") {
          detail.style.maxHeight = 0 + "px";
        } else {
          detail.style.maxHeight = content.scrollHeight + "px";
        }
      }



    });

    const id = this.expandedId;

    if (id) {
      const accordion = document.getElementById(id);
      const content = accordion.querySelector(".accordion-content");
      content.setAttribute('aria-show', 'true');
      content.style.maxHeight = content.scrollHeight + "px";

      content.querySelectorAll('iframe').forEach((iframeEl) => {
        if (
          iframeEl.getAttribute('src') === 'about:blank' &&
          iframeEl.dataset.src !== undefined
        ) {
          iframeEl.setAttribute('src', iframeEl.dataset.src);
        }
      });

      // Lazy load images
      content.querySelectorAll('img').forEach((imgEl) => {
        if (imgEl.getAttribute('src') === '' && imgEl.dataset.src !== undefined) {
          imgEl.setAttribute('src', imgEl.dataset.src);
        }
      });
    }
  }

  togglePreview(e) {

    const link = e.currentTarget;
    const {accordionUrl} = link.dataset;
    const accordion = document.getElementById(accordionUrl);
    const content = accordion.querySelector(".accordion-content");
    const label = accordion.querySelector(".accordion-label");

    this.expandedId = this.expandedId === accordionUrl ? null : accordionUrl;

    this.itemTargets.forEach((el) => {
      if (el != accordion) {
        const content = el.querySelector(".accordion-content");
        if (content.getAttribute('aria-show') == "true") {
          content.setAttribute('aria-show', 'false');
          content.style.maxHeight = 0 + "px";
        }
      }
    });

    if (content.getAttribute('aria-show') == "false") {
      content.setAttribute('aria-show', 'true');
      content.style.maxHeight = content.scrollHeight + "px";
      if (this.data.get('openPreviewLabel')) {
        label.innerHTML = this.data.get('openPreviewLabel');
      }

    } else {
      content.setAttribute('aria-show', 'false');
      content.style.maxHeight = 0 + "px";

      if (this.data.get('closePreviewLabel')) {
        label.innerHTML = this.data.get('closePreviewLabel');
      }


    }

    e.stopPropagation();
    e.preventDefault();
  }


  toggleDetail(e) {
    const link = e.currentTarget;
    const {accordionUrl} = link.dataset;
    const accordion = document.getElementById(accordionUrl);
    const content = accordion.querySelector(".accordion-content");
    const detail = accordion.querySelector(".accordion-detail");
    const label = accordion.querySelector(".accordion-label-detail");

    if (detail.getAttribute('aria-show') == "false") {
      detail.setAttribute('aria-show', 'true');
      detail.style.maxHeight = detail.scrollHeight + "px";
      content.style.maxHeight = content.scrollHeight + detail.scrollHeight + "px";

      detail.querySelectorAll('iframe').forEach((iframeEl) => {
        if (
          iframeEl.getAttribute('src') === 'about:blank' &&
          iframeEl.dataset.src !== undefined
        ) {
          iframeEl.setAttribute('src', iframeEl.dataset.src);
        }
      });

      // Lazy load images
      detail.querySelectorAll('img').forEach((imgEl) => {
        if (imgEl.getAttribute('src') === '' && imgEl.dataset.src !== undefined) {
          imgEl.setAttribute('src', imgEl.dataset.src);
        }
      });

      if (this.data.get('openDetailLabel')) {
        label.innerHTML = this.data.get('openDetailLabel');
      }

    } else {
      detail.setAttribute('aria-show', 'false');
      detail.style.maxHeight = 0 + "px";
      content.style.maxHeight = content.scrollHeight + "px";

      if (this.data.get('closeDetailLabel')) {
        label.innerHTML = this.data.get('closeDetailLabel');
      }
    }

    e.stopPropagation();
    e.preventDefault();
  }

  get expandedId() {
    const match = window.location.hash.match(/^#(slib-[0-9]+)$/);
    return match ? match[1] : null;
  }
  set expandedId(id) {
    const anchor = id !== null ? `#${id}` : '';

    window.history.pushState(
      undefined,
      undefined,
      window.location.pathname + window.location.search + anchor,
    );
  }

}
