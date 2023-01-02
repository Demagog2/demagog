import { Controller } from 'stimulus';

export default class extends Controller {
  accept() {
    this.callApi('accept').then(() => {
      console.log("accept");
      window.location.reload();
    });
  }

  reject() {
    console.log("reject");
    this.callApi('reject').then(() => {
      window.location.reload();
    });
  }

  callApi(decision) {
    const formData = new FormData();
    formData.append('decision', decision);

    return fetch('/cookies/analytics', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    });
  }
}
