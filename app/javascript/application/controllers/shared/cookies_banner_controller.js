import { Controller } from 'stimulus';

export default class extends Controller {
  accept() {
    console.log('accept');
    this.callApi('accept');
    this.element.remove();

    // Notify Google Tag Manager that we have the consent
    const dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  }

  reject() {
    // Notify Google Tag Manger we don't have consent
    const dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });

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
