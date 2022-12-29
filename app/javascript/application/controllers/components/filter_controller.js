import { Controller } from 'stimulus';
import * as queryString from 'query-string';
import debounce from 'lodash/debounce';

export default class extends Controller {
  static targets = [ 'filter', 'content', 'rows', 'label', 'filtersForm', 'filterCheckbox', 'filterLink', 'searchInput', 'filterItem']

  connect() {
    if (this.filterTarget.getAttribute('aria-show') == "false") {
      this.hide();
    }
  }

  initialize() {
    this.setFilterValues();
    this.setUpLinks();
    this.setUpContent();
  }

  toggle(event) {
    event.preventDefault();
    if (this.filterTarget.getAttribute('aria-show') == "false") {
      this.show();
      this.setUpLinks()
    } else {
      this.hide();
    }
  }

  toggleLink(e) {
    const link = e.target;
    const content = link.nextElementSibling;
    if (link.getAttribute('aria-show') == "false") {
      this.showContent(link, content);
    } else {
      this.hideContent(link, content);
    }
  }

  showContent(link, content) {
    link.setAttribute('aria-show', 'true');
    link.classList.add('open');
    content.style.maxHeight = content.scrollHeight + "px";
  }

  hideContent(link, content) {
    link.setAttribute('aria-show', 'false');
    link.classList.remove('open');
    content.style.maxHeight = 0;
  }

  setUpLinks() {
    this.filterLinkTargets.forEach((el) => {
      const content = el.nextElementSibling;
      if (el.getAttribute('aria-show') == "false") {
        content.style.maxHeight = 0 + "px";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }

  hide() {
    this.filterTarget.setAttribute('aria-show', 'false');
    this.filterTarget.classList.add('hide');
    if (this.data.get('closeCols')) {
      this.contentTarget.classList = this.data.get('closeCols')
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
    if (this.data.get('openCols')) {
        this.contentTarget.classList = this.data.get('openCols')
    }
    if (this.data.get('openRows') && this.data.get('closeRows')) {
      this.rowsTarget.classList = this.data.get('openRows');
    }

    if (this.data.get('openLabel') && this.data.get('closeLabel')) {
      this.labelTarget.innerHTML = this.data.get('openLabel');
    }
  }

  toggleFilter(e){
    const { filterType, filterValue } = e.currentTarget.dataset;
    const queryParams = queryString.parse(window.location.search, { arrayFormat: 'bracket' });
    const baseUrl = location.protocol + '//' + location.host + location.pathname;

    if (!queryParams[filterType]) {
      queryParams[filterType] = [];
    }

    if (queryParams[filterType].includes(filterValue)) {
      queryParams[filterType] = queryParams[filterType].filter((v) => v !== filterValue);
    } else {
      queryParams[filterType] = [...queryParams[filterType], filterValue];
    }

    let queryParamsAsString = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
    if (queryParamsAsString !== '') {
      queryParamsAsString = '?' + queryParamsAsString;
    }

    if (this.data.get('type') == "reload") {
      window.location = baseUrl + queryParamsAsString;
    } else {
      history.pushState(undefined, undefined, window.location.pathname + queryParamsAsString);
      this.setUpContent();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  setFilterValues() {
    const queryParams = queryString.parse(window.location.search, { arrayFormat: 'bracket' });
    const types = Object.values(queryParams);
    if (types.length) {
      const values = [].concat(...types);

      if (values.length) {
        this.filterCheckboxTargets.forEach((el) => {
          if (values.includes(el.dataset.filterValue)) {
            el.checked = true;
          } else {
            el.checked = false;
          }
        });
      }
    }
    if (!types.length) {
      if (this.data.get('closeEmpty') === "true") {
        this.hide();
      }
    }

  }

  clearFilter(e) {
    const baseUrl = location.protocol + '//' + location.host + location.pathname;
    window.location.href = baseUrl;

    e.stopPropagation();
    e.preventDefault();
  }

  setUpContent() {
    if (this.filterItemTargets) {
      const queryParams = queryString.parse(window.location.search, { arrayFormat: 'bracket' });
      const filterValues = Object.values(queryParams);
      if (filterValues.length) {
        const mergeFilterValues = [].concat(...filterValues)
        this.filterItemTargets.forEach((el) => {
          const itemValues = el.dataset.filterValue.split(",");
          const intersection = itemValues.filter(element => mergeFilterValues.includes(element));
          if (intersection.length == filterValues.length) {
            if (el.classList.contains("hide")) {
              el.classList.remove("hide");
            }
          } else {
            if (!el.classList.contains("hide")) {
              el.classList.add("hide");
            }
          }
        });
      } else {
        this.filterItemTargets.forEach((el) => {
          if (el.classList.contains("hide")) {
            el.classList.remove("hide");
          }
        });
      }
    }
  }

  onSearchSubmit(e) {
    const input = this.searchInputTarget;
    const baseUrl = location.protocol + '//' + location.host + location.pathname;
    const queryParams = {};

    this.filterCheckboxTargets.forEach((el) => {
      if (el.checked) {
        queryParams[el.name] = el.value;
      }
    });

    if (input.value != '') {
      queryParams[input.name] = input.value;
    }

    let queryParamsAsString = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
    if (queryParamsAsString !== '') {
      queryParamsAsString = '?' + queryParamsAsString;
    }

    window.location = baseUrl + queryParamsAsString;

    e.stopPropagation();
    e.preventDefault();
  }
}
