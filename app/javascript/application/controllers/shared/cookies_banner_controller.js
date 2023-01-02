import { Controller } from 'stimulus';

export default class extends Controller {
  accept() {
    console.log("accept");
    this.callApi('accept');
    this.element.remove();

    // Notify Google Tag Manager that we have the consent
    const dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }

  reject() {
    this.callApi('reject');
    this.element.remove();
  }

  callApi(decision) {
    const formData = new FormData();
    formData.append('decision', decision);

    fetch('/cookies/analytics', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    });
  }
}
