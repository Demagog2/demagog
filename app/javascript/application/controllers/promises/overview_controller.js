import { Controller } from 'stimulus';
import * as queryString from 'query-string';

export default class extends Controller {
  static targets = [
    'summaryRow',
    'detailRow',
    'areaTagFilterOption',
    'areaTagFilterClear',
    'promiseRatingFilterOption',
    'promiseRatingFilterClear',
  ];

  initialize() {
    this.queryParamsFilterKeys = JSON.parse(this.data.get('queryParamsFilterKeys'));
    this.queryParamsFilterValues = JSON.parse(this.data.get('queryParamsFilterValues'));

    this.propagateExpandedIdToDom();
    this.propagateFiltersToDom();
  }

  handleWindowPopstate() {
    this.propagateExpandedIdToDom();
    this.propagateFiltersToDom();
  }

  toggleDetail(e) {
    const id = e.currentTarget.closest('tr.summary').id;

    this.expandedId = this.expandedId === id ? null : id;

    e.stopPropagation();
    e.preventDefault();
  }

  propagateExpandedIdToDom() {
    this.summaryRowTargets.forEach((el) => {
      el.classList.toggle('expanded', el.id === this.expandedId);
    });
    this.detailRowTargets.forEach((el) => {
      const isExpanded = el.dataset.id === this.expandedId;
      el.classList.toggle('expanded', isExpanded);

      if (isExpanded) {
        // Lazy load iframes
        el.querySelectorAll('.explanation iframe').forEach((iframeEl) => {
          if (
            iframeEl.getAttribute('src') === 'about:blank' &&
            iframeEl.dataset.src !== undefined
          ) {
            iframeEl.setAttribute('src', iframeEl.dataset.src);
          }
        });

        // Lazy load images
        el.querySelectorAll('.explanation img').forEach((imgEl) => {
          if (imgEl.getAttribute('src') === '' && imgEl.dataset.src !== undefined) {
            imgEl.setAttribute('src', imgEl.dataset.src);
          }
        });
      }
    });
  }

  // Expanded ID state is stored in location hash
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

    this.propagateExpandedIdToDom();
  }

  toggleFilter(e) {
    const { filterType, filterValue } = e.currentTarget.dataset;
    let filters = this.filters;

    if (filters[filterType].includes(filterValue)) {
      filters[filterType] = filters[filterType].filter((v) => v !== filterValue);
    } else {
      filters[filterType] = [...filters[filterType], filterValue];
    }

    this.filters = filters;
    this.expandedId = null;

    e.stopPropagation();
    e.preventDefault();
  }

  clearFilter(e) {
    const { filterType } = e.currentTarget.dataset;

    this.filters = {
      ...this.filters,
      [filterType]: [],
    };
    this.expandedId = null;

    e.stopPropagation();
    e.preventDefault();
  }

  propagateFiltersToDom() {
    const filters = this.filters;

    const showPromiseIds = this.summaryRowTargets
      .filter((el) => {
        if (
          filters.area_tag.length !== 0 &&
          !filters.area_tag.includes(el.dataset.areaTagFilterValue)
        ) {
          return false;
        }
        if (
          filters.promise_rating.length !== 0 &&
          !filters.promise_rating.includes(el.dataset.promiseRatingFilterValue)
        ) {
          return false;
        }
        return true;
      })
      .map((el) => el.id);

    this.summaryRowTargets.forEach((el) => {
      el.classList.toggle('hidden', !showPromiseIds.includes(el.id));
    });
    this.detailRowTargets.forEach((el) => {
      el.classList.toggle('hidden', !showPromiseIds.includes(el.dataset.id));
    });

    this.areaTagFilterOptionTargets.forEach((el) => {
      el.classList.toggle('active', filters.area_tag.includes(el.dataset.filterValue));
    });
    this.promiseRatingFilterOptionTargets.forEach((el) => {
      el.classList.toggle('active', filters.promise_rating.includes(el.dataset.filterValue));
    });

    this.areaTagFilterClearTarget.classList.toggle('hidden', filters.area_tag.length === 0);
    this.promiseRatingFilterClearTarget.classList.toggle(
      'hidden',
      filters.promise_rating.length === 0,
    );
  }

  // Filters state is stored in query
  get filters() {
    const queryParams = queryString.parse(window.location.search, { arrayFormat: 'bracket' });
    const filters = {};

    Object.keys(this.queryParamsFilterKeys).forEach((filterType) => {
      const queryParamKey = this.queryParamsFilterKeys[filterType];

      const queryParamValues = queryParams[queryParamKey] || [];
      if (!Array.isArray(queryParamValues)) {
        queryParamValues = [];
      }

      const filterValues = [];
      queryParamValues.forEach((queryParamValue) => {
        for (const filterValue in this.queryParamsFilterValues[filterType]) {
          if (queryParamValue === this.queryParamsFilterValues[filterType][filterValue]) {
            filterValues.push(filterValue);
          }
        }
      });

      filters[filterType] = filterValues;
    });

    return filters;
  }
  set filters(filters) {
    const queryParams = {};

    Object.keys(filters).forEach((type) => {
      const queryParamKey = this.queryParamsFilterKeys[type];

      queryParams[queryParamKey] = filters[type].map(
        (valueId) => this.queryParamsFilterValues[type][valueId],
      );
    });

    let queryParamsAsString = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
    if (queryParamsAsString !== '') {
      queryParamsAsString = '?' + queryParamsAsString;
    }

    history.pushState(undefined, undefined, window.location.pathname + queryParamsAsString);
    this.propagateFiltersToDom();
  }

  toggleFullExplanation(e) {
    const explanationEl = e.currentTarget.closest('.explanation');
    explanationEl.classList.toggle('with-full-explanation');

    e.stopPropagation();
    e.preventDefault();
  }
}
