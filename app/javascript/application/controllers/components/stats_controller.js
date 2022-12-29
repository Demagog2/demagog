import { Controller } from 'stimulus';

export default class extends Controller {
  toggleLink(e) {
    const url = e.currentTarget.dataset.url;
    const count = e.currentTarget.dataset.count;
    const baseUrl = location.protocol + '//' + location.host + location.pathname;
    const queryParams = window.location.search;

    if (count && +count > 0) {
      if (url == queryParams) {
        window.location = baseUrl
      } else {
        window.location = baseUrl + url;
      }
    } else {
      window.location = baseUrl;
    }


  }
}
