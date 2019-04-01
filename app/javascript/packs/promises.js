document.addEventListener('DOMContentLoaded', () => {
  // If there is already promise hash in the url, expand that promise detail
  if (window.location.hash !== '' && window.location.hash.match(/^#slib[0-9]+$/)) {
    const promiseLineNode = document.querySelector(window.location.hash);
    if (promiseLineNode !== null) {
      expandPromiseDetail(promiseLineNode);
    }
  }

  // Expand and collapse promises and update filtered list when changing history
  // via forward/back buttons in browser
  window.onpopstate = () => {
    collapseAllPromiseDetails();
    showOnlyFilteredPromises();

    const queryParams = parseQuery(window.location.search);
    document.querySelectorAll('.filter-button').forEach((filterButtonElement) => {
      let active = false;
      if (queryParams[filterButtonElement.dataset.param] !== undefined) {
        active =
          queryParams[filterButtonElement.dataset.param] === filterButtonElement.dataset.slug;
      }

      filterButtonElement.classList.toggle('active', active);
    });
    document.querySelectorAll('.clear-filters').forEach((clearFiltersElement) => {
      const show = queryParams[clearFiltersElement.dataset.param] !== undefined;
      clearFiltersElement.classList.toggle('hidden', !show);
    });

    if (window.location.hash !== '' && window.location.hash.match(/^#slib[0-9]+$/)) {
      const promiseLineNode = document.querySelector(window.location.hash);
      if (promiseLineNode !== null) {
        expandPromiseDetail(promiseLineNode);
      }
    }
  };

  document.querySelectorAll('.promise-line').forEach((promiseLineNode) => {
    // Expand promise detail when expand link is clicked
    promiseLineNode.querySelector('.promise-link-expand').addEventListener('click', (e) => {
      collapseAllPromiseDetails();
      expandPromiseDetail(promiseLineNode);

      // history.pushState(undefined, undefined, e.currentTarget.getAttribute('href'));
      history.pushState(
        undefined,
        undefined,
        window.location.pathname + window.location.search + e.currentTarget.dataset.anchor,
      );

      e.preventDefault();
      return false;
    });

    // Collapse promise detail when collapse link is clicked
    promiseLineNode.querySelector('.promise-link-collapse').addEventListener('click', (e) => {
      collapseAllPromiseDetails();

      // history.pushState(undefined, undefined, e.currentTarget.getAttribute('href'));
      history.pushState(
        undefined,
        undefined,
        window.location.pathname + window.location.search + e.currentTarget.dataset.anchor,
      );

      e.preventDefault();
      return false;
    });
  });

  document.querySelectorAll('.filter-button').forEach((filterButtonElement) => {
    filterButtonElement.addEventListener('click', (e) => {
      collapseAllPromiseDetails();

      filterButtonElement.parentElement.querySelectorAll('.filter-button').forEach((element) => {
        element.classList.toggle('active', element === filterButtonElement);
      });
      filterButtonElement.parentElement.parentElement
        .querySelector('.clear-filters')
        .classList.remove('hidden');

      setQueryParam(filterButtonElement.dataset.param, filterButtonElement.dataset.slug);

      showOnlyFilteredPromises();

      e.preventDefault();
      return false;
    });
  });

  document.querySelectorAll('.clear-filters').forEach((clearFiltersElement) => {
    clearFiltersElement.addEventListener('click', (e) => {
      collapseAllPromiseDetails();

      clearFiltersElement.parentElement.querySelectorAll('.filter-button').forEach((element) => {
        element.classList.remove('active');
      });
      clearFiltersElement.classList.add('hidden');

      removeQueryParam(clearFiltersElement.dataset.param);

      showOnlyFilteredPromises();

      e.preventDefault();
      return false;
    });
  });

  function collapseAllPromiseDetails() {
    document.querySelectorAll('.promise-line').forEach((promiseLineElement) => {
      promiseLineElement.classList.remove('expanded');

      document
        .querySelector('#' + promiseLineElement.dataset.detailId)
        .classList.remove('expanded');
    });
  }

  function expandPromiseDetail(promiseLineElement) {
    promiseLineElement.classList.add('expanded');

    const promiseDetailElement = document.querySelector('#' + promiseLineElement.dataset.detailId);

    promiseDetailElement.classList.add('expanded');

    // Load all the iframes in the expanded promise detail explanation
    promiseDetailElement.querySelectorAll('.explanation iframe').forEach((iframeElement) => {
      if (
        iframeElement.getAttribute('src') === 'about:blank' &&
        iframeElement.dataset.src !== undefined
      ) {
        iframeElement.setAttribute('src', iframeElement.dataset.src);
      }
    });
  }

  function showOnlyFilteredPromises() {
    const queryParams = parseQuery(window.location.search);

    document.querySelectorAll('.promise-line').forEach((promiseLineElement) => {
      let show = true;
      if (queryParams.oblast !== undefined) {
        show = show && promiseLineElement.dataset.oblast === queryParams.oblast;
      }
      if (queryParams.hodnoceni !== undefined) {
        show = show && promiseLineElement.dataset.hodnoceni === queryParams.hodnoceni;
      }

      promiseLineElement.classList.toggle('hidden', !show);
      promiseLineElement.nextElementSibling.classList.toggle('hidden', !show);
    });
  }

  function setQueryParam(param, value) {
    const queryParams = parseQuery(window.location.search);
    queryParams[param] = value;
    history.pushState(undefined, undefined, window.location.pathname + buildQuery(queryParams));
  }

  function removeQueryParam(param) {
    const queryParams = parseQuery(window.location.search);
    delete queryParams[param];
    history.pushState(undefined, undefined, window.location.pathname + buildQuery(queryParams));
  }

  function parseQuery(queryString) {
    const query = {};
    let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    pairs = pairs.filter((pair) => pair !== '');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  function buildQuery(queryParams) {
    if (Object.keys(queryParams).length === 0) {
      return '';
    }

    return (
      '?' +
      Object.keys(queryParams)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
        .join('&')
    );
  }
});
