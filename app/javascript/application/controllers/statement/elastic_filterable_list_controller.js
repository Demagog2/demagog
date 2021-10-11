import { Controller } from 'stimulus';
import * as queryString from 'query-string';

export default class extends Controller {
  static targets = ['filtersForm'];

  onFilterSelectChange() {
    this.buildAndGoToFiltersUrl();
  }

  onFilterCheckboxChange() {
    this.buildAndGoToFiltersUrl();
  }

  onFulltextConfirmButton() {
    this.buildAndGoToFiltersUrl();
  }

  onFiltersListSubmit(e) {
    this.buildAndGoToFiltersUrl();

    e.stopPropagation();
    e.preventDefault();
  }

  buildAndGoToFiltersUrl() {
    const noFiltersUrl = this.data.get('noFiltersUrl');
    const queryParams = {};

    this.filtersFormTarget.querySelectorAll('input, select').forEach((el) => {
      console.log('-------', { el });
      if (el.type === 'checkbox') {
        if (el.checked) {
          queryParams[el.name] = el.value;
        }
      } else {
        if (el.value != '') {
          queryParams[el.name] = el.value;
        }
      }
    });

    let queryParamsAsString = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
    if (queryParamsAsString !== '') {
      queryParamsAsString = '?' + queryParamsAsString;
    }

    window.location = noFiltersUrl + queryParamsAsString;
  }
}
