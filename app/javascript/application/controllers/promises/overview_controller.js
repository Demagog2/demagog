import { Controller } from 'stimulus';
import * as queryString from 'query-string';

export default class extends Controller {
  static targets = [
    'summaryRow',
    'detailRow',
    'areaFilterOption',
    'areaFilterClear',
    'evaluationFilterOption',
    'evaluationFilterClear',
  ];

  initialize() {
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
        if (filters.area.length !== 0 && !filters.area.includes(el.dataset.areaFilterValue)) {
          return false;
        }
        if (
          filters.evaluation.length !== 0 &&
          !filters.evaluation.includes(el.dataset.evaluationFilterValue)
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

    this.areaFilterOptionTargets.forEach((el) => {
      el.classList.toggle('active', filters.area.includes(el.dataset.filterValue));
    });
    this.evaluationFilterOptionTargets.forEach((el) => {
      el.classList.toggle('active', filters.evaluation.includes(el.dataset.filterValue));
    });

    this.areaFilterClearTarget.classList.toggle('hidden', filters.area.length === 0);
    this.evaluationFilterClearTarget.classList.toggle('hidden', filters.evaluation.length === 0);
  }

  // Filters state is stored in query
  get filters() {
    const queryParams = queryString.parse(window.location.search, { arrayFormat: 'bracket' });
    const filters = {};

    queryParamsFilterConfigs.forEach((filterConfig) => {
      const queryParamValues = queryParams[filterConfig.queryParamKey] || [];
      if (!Array.isArray(queryParamValues)) {
        queryParamValues = [];
      }

      const filterValues = [];
      queryParamValues.forEach((queryParamValue) => {
        const filterConfigValue = filterConfig.values.find(
          (v) => v.queryParamValue === queryParamValue,
        );

        if (filterConfigValue !== undefined) {
          filterValues.push(filterConfigValue.id);
        }
      });

      filters[filterConfig.type] = filterValues;
    });

    return filters;
  }
  set filters(filters) {
    const queryParams = {};

    Object.keys(filters).forEach((type) => {
      const filterConfig = queryParamsFilterConfigs.find((fc) => fc.type === type);
      const queryParamValues = filters[type].map(
        (valueId) => filterConfig.values.find((v) => v.id === valueId).queryParamValue,
      );

      queryParams[filterConfig.queryParamKey] = queryParamValues;
    });

    let queryParamsAsString = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
    if (queryParamsAsString !== '') {
      queryParamsAsString = '?' + queryParamsAsString;
    }

    history.pushState(undefined, undefined, window.location.pathname + queryParamsAsString);
    this.propagateFiltersToDom();
  }
}

const queryParamsFilterConfigs = [
  {
    type: 'area',
    queryParamKey: 'oblast',
    values: [
      { id: 'hospodarstvi', queryParamValue: 'hospodarstvi' },
      { id: 'zivotni-prostredi', queryParamValue: 'zivotni-prostredi' },
      { id: 'socialni-stat', queryParamValue: 'socialni-stat' },
      { id: 'vzdelanost', queryParamValue: 'vzdelanost' },
      { id: 'pravni-stat', queryParamValue: 'pravni-stat' },
      { id: 'bezpecnost', queryParamValue: 'bezpecnost' },
    ],
  },
  {
    type: 'evaluation',
    queryParamKey: 'hodnoceni',
    values: [
      { id: 'fulfilled', queryParamValue: 'splnene' },
      { id: 'partially_fulfilled', queryParamValue: 'castecne-splnene' },
      { id: 'broken', queryParamValue: 'porusene' },
      { id: 'stalled', queryParamValue: 'nerealizovane' },
    ],
  },
];
