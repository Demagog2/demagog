import { Controller } from 'stimulus';
import * as queryString from 'query-string';
import invert from 'lodash/invert';

export default class extends Controller {
  static targets = ['statement', 'filteredCountInfo'];

  queryParamKeys = {
    speaker_id: 'recnik',
    tag_id: 'tema',
    veracity_key: 'hodnoceni',
  };

  veracityValuesMap = {
    true: 'pravda',
    untrue: 'nepravda',
    misleading: 'zavadejici',
    unverifiable: 'neoveritelne',
  };

  connect() {
    this.propagateFiltersToDom();
  }

  handleWindowPopstate() {
    this.propagateFiltersToDom();
  }

  onFilterSelectChange() {
    const queryParamKeyToFilterType = invert(this.queryParamKeys);
    const filters = this.filters;

    this.element.querySelectorAll('select').forEach((selectEl) => {
      if (queryParamKeyToFilterType[selectEl.name]) {
        const filterType = queryParamKeyToFilterType[selectEl.name];

        filters[filterType] = selectEl.value;

        if (filterType === 'veracity_key') {
          filters[filterType] = invert(this.veracityValuesMap)[filters[filterType]];
        }
      }
    });

    this.filters = filters;
  }

  clearFilters() {
    this.filters = {};

    this.propagateFiltersToDom();
  }

  // Filters state is stored in query
  get filters() {
    const queryParams = queryString.parse(window.location.search, { arrayFormat: 'bracket' });
    const filters = {};

    ['speaker_id', 'tag_id', 'veracity_key'].forEach((filterType) => {
      const queryParamKey = this.queryParamKeys[filterType];

      filters[filterType] = queryParams[queryParamKey] || null;

      if (filterType === 'veracity_key') {
        filters[filterType] = invert(this.veracityValuesMap)[filters[filterType]];
      }
    });

    return filters;
  }
  set filters(filters) {
    const queryParams = {};

    ['speaker_id', 'tag_id', 'veracity_key'].forEach((filterType) => {
      const queryParamKey = this.queryParamKeys[filterType];

      if (filters[filterType]) {
        queryParams[queryParamKey] = filters[filterType];

        if (filterType === 'veracity_key') {
          queryParams[queryParamKey] = this.veracityValuesMap[queryParams[queryParamKey]];
        }
      }
    });

    let queryParamsAsString = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
    if (queryParamsAsString !== '') {
      queryParamsAsString = '?' + queryParamsAsString;
    }

    window.history.pushState(undefined, undefined, window.location.pathname + queryParamsAsString);
    this.propagateFiltersToDom();
  }

  propagateFiltersToDom() {
    const filters = this.filters;

    // If the name of tag or speaker changes, we want the filtering work, so match just by the ID
    const onlyId = (value) => {
      const matched = value.match(/(\d+)$/);
      return matched ? matched[1] : value;
    };

    const showStatementHtmlIds = this.statementTargets
      .filter((el) => {
        if (filters.speaker_id && onlyId(filters.speaker_id) != onlyId(el.dataset.speakerId)) {
          return false;
        }
        if (
          filters.tag_id &&
          !el.dataset.tagIds
            .split('||')
            .map((tagId) => onlyId(tagId))
            .includes(onlyId(filters.tag_id))
        ) {
          return false;
        }
        if (filters.veracity_key && filters.veracity_key != el.dataset.veracityKey) {
          return false;
        }
        return true;
      })
      .map((el) => el.id);

    this.statementTargets.forEach((el) => {
      el.classList.toggle('hidden', !showStatementHtmlIds.includes(el.id));
    });

    const queryParamKeyToFilterType = invert(this.queryParamKeys);

    this.element.querySelectorAll('select').forEach((selectEl) => {
      if (queryParamKeyToFilterType[selectEl.name]) {
        const filterType = queryParamKeyToFilterType[selectEl.name];

        if (filters[filterType]) {
          selectEl.value = filters[filterType];

          if (filterType === 'veracity_key') {
            selectEl.value = this.veracityValuesMap[filters[filterType]];
          }
        } else {
          selectEl.value = '';
        }
      }
    });

    this.filteredCountInfoTarget.classList.toggle(
      'hidden',
      showStatementHtmlIds.length === this.statementTargets.length,
    );

    let label;
    if (showStatementHtmlIds.length > 4) {
      label = `Vyfiltrováno ${showStatementHtmlIds.length} ze všech ${this.statementTargets.length} výroků`;
    } else if (showStatementHtmlIds.length > 1) {
      label = `Vyfiltrovány ${showStatementHtmlIds.length} ze všech ${this.statementTargets.length} výroků`;
    } else if (showStatementHtmlIds.length === 1) {
      label = `Vyfiltrován ${showStatementHtmlIds.length} ze všech ${this.statementTargets.length} výroků`;
    } else {
      label = `Vybraným filtrům nevyhovuje ani jeden ze všech ${this.statementTargets.length} výroků`;
    }
    this.filteredCountInfoTarget.querySelector('.filtered-count-info-label').innerHTML = label;
  }
}
