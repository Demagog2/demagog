window.__demagogczInitializeWidgets__ = () => {
  [].slice.call(document.getElementsByTagName('demagogcz-widget')).forEach((widgetEl) => {
    if (widgetEl.dataset.initialized) {
      return;
    }

    const iframeEl = document.createElement('iframe');
    iframeEl.src = widgetEl.dataset.url;
    iframeEl.style = 'width: 100%; border: none; box-shadow: none; overflow: hidden;';

    widgetEl.parentNode.insertBefore(iframeEl, widgetEl);
    widgetEl.dataset.initialized = true;

    const receiveMessage = (e) => {
      if (e.origin === 'https://demagog.cz' && e.data.type === 'documentHeight') {
        iframeEl.style.height = e.data.payload + 'px';
      }
    };

    window.addEventListener('message', receiveMessage);
  });
};

document.addEventListener('DOMContentLoaded', window.__demagogczInitializeWidgets__);
