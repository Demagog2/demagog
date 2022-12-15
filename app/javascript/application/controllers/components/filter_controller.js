import { Controller } from 'stimulus';
import * as queryString from 'query-string';

export default class extends Controller {
  static targets = [ 'filter', 'content', 'rows', 'label', 'filtersForm']

  connect() {
    if (this.filterTarget.getAttribute('aria-show') == "false") {
      this.hide();
    }
  }

  toggle(event) {
    event.preventDefault();
    if (this.filterTarget.getAttribute('aria-show') == "false") {
      this.show();
    } else {
      this.hide();
    }
  }

  hide() {
    this.filterTarget.setAttribute('aria-show', 'false');
    this.filterTarget.classList.add('hide');
    if (this.data.get('contentCols')) {
      this.contentTarget.classList = 'col col-12';
    }
    if (this.data.get('openRows') && this.data.get('closeRows')) {
      this.rowsTarget.classList = this.data.get('closeRows');
    }

    if (this.data.get('openLabel') && this.data.get('closeLabel')) {
      this.labelTarget.innerHTML = this.data.get('closeLabel');
    }
    

  }

  show() {
    this.filterTarget.setAttribute('aria-show', 'true');
    this.filterTarget.classList.remove('hide');
    if (this.data.get('contentCols')) {
      this.contentTarget.classList = this.data.get('contentCols');
    }

    if (this.data.get('openRows') && this.data.get('closeRows')) {
      this.rowsTarget.classList = this.data.get('openRows');
    }

    if (this.data.get('openLabel') && this.data.get('closeLabel')) {
      this.labelTarget.innerHTML = this.data.get('openLabel');
    }
  }

  setFilter(){
    console.log("Filter");
    this.buildAndGoToFiltersUrl();
  }

  buildAndGoToFiltersUrl() {
    const noFiltersUrl = this.data.get('noFiltersUrl');
    const queryParams = {};

    this.filtersFormTarget.querySelectorAll('input, select').forEach((el) => {
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
