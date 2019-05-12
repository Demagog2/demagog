import debounce from 'lodash/debounce';

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

    iframeEl.addEventListener('load', () => {
      iframeEl.style.height = iframeEl.contentWindow.document.body.offsetHeight + 'px';

      function updateIframeHeight() {
        iframeEl.style.height = iframeEl.contentWindow.document.body.offsetHeight + 'px';
      }

      window.addEventListener('resize', debounce(updateIframeHeight, 400));
    });
  });
};

document.addEventListener('DOMContentLoaded', window.__demagogczInitializeWidgets__);
