import Component from '@glimmer/component';
import { timeout, keepLatestTask } from 'ember-concurrency';
import { getOwner } from '@ember/application';
import { Promise } from 'rsvp';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const DEBOUNCE_MS = 100;

export default class LabsSearchComponent extends Component {
  @tracked currResults = [];
  @tracked searchHistory = [];
  @tracked filteredSearchHistory = [];
  @tracked searchTerms = '';
  @tracked selected = 0;
  @tracked _focused = false;
  @tracked loading = null;

  get useSearchHistory() { return this.args.useSearchHistory ?? false; }
  get searchPlaceholder() { return this.args.searchPlaceholder ?? 'Search...'; }

  get onSelect() { return this.args.onSelect || (() => {}); }
  get onHoverResult() { return this.args.onHoverResult || (() => {}); }
  get onHoverOut() { return this.args.onHoverOut || (() => {}); }
  get onClear() { return this.args.onClear || (() => {}); }

  typeTitleLookup = { lot: 'Lot' };
  host = 'https://search-api-production.herokuapp.com';
  route = 'search';
  helpers = ['geosearch', 'city-map-street-search', 'city-map-alteration'];

  constructor() {
    super(...arguments);

    const config = getOwner(this).resolveRegistration('config:environment');
    const {
      host = this.host,
      route = this.route,
      helpers = this.helpers,
    } = config?.['labs-search'] || {};

    this.host = host;
    this.route = route;
    this.helpers = helpers;

    this.searchHistory = window.localStorage.getItem('search-history')
      ? JSON.parse(window.localStorage.getItem('search-history'))
      : []
    ;
  };

  get results() {
    return this.debouncedResults.lastSuccessful?.value || [];
  }

  // resultsCount = computed('results.value', function () {
  //   const results = this.get('results.value');
  //   if (results) return results.length;
  //   return 0;
  // });

  get resultsCount() {
    const resultsVal = this.debouncedResults.lastSuccessful?.value || [];
    return resultsVal.length;
  }

  // endpoint =computed('helpers', 'host', 'route', 'searchTerms', function () {
  //   const searchTerms = this.searchTerms;
  //   const host = this.host;
  //   const route = this.route;
  //   const helpers = this.helpers
  //     .map((string) => `helpers[]=${string}&`)
  //     .join('');

  //   return `${host}/${route}?${helpers}q=${searchTerms}`;
  // });

  get endpoint() {
    const helpers = this.helpers.map((string) => `helpers[]=${string}&`).join('');
    return `${this.host}/${this.route}?${helpers}q=${this.searchTerms}`;
  }

  @keepLatestTask
  *debouncedResults(searchTerms) {
    this.filterSearchHistory(searchTerms);
    
    if (searchTerms.length < 2) {
      this.currResults = this.filteredSearchHistory;
      return;
    }

    yield timeout(DEBOUNCE_MS);
    const URL = this.endpoint;

    this.loading = 
      new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    

    try {
      const raw = yield fetch(URL);
      console.log("raw", raw);
      const resultList = yield raw.json();

      const mergedWithTitles = resultList.map((result, index) => {
        const mutatedResult = result;
        mutatedResult.id = index;
        mutatedResult.typeTitle =
          this.typeTitleLookup[result.type] || 'Result';
        return mutatedResult;
      });

      this.currResults =
        this.filteredSearchHistory.concat(mergedWithTitles);
      this.loading = null;

      return mergedWithTitles;
    } catch(e) {
      console.error('Error fetching search results', e);
      this.loading = null;
      return [];
    } finally {
      this.loading = null;
    }
  };

  @action
  handleKeyPress(event) {
    const selected = this.selected;
    console.log("on handleKeyPress");
    const { keyCode } = event;

    // enter
    if (keyCode === 13) {
      const results = this.results.value;
      if (results && results.length > 0) {
        const selectedResult = results[selected];
        this.goTo(selectedResult);
      }
    }
  };

  @action
  handleInput(event){
    this.searchTerms = event.target.value;
    this.debouncedResults.perform(this.searchTerms);
  }

  @action
  handleKeyUp(event) {
        console.log("on handleKeyUp");

    const selected = this.selected;
    const resultsCount = this.resultsCount;
    const { keyCode } = event;

    if ([38, 40, 27].includes(keyCode)) {
      // up
      if (keyCode === 38) {
        if (this.results) {
          if (selected > 0) this.selected = selected - 1;
        }
      }

      // down
      if (keyCode === 40) {
        if (this.results) {
          if (selected < resultsCount - 1) this.selected = selected + 1;
        }
      }

      // escape
      if (keyCode === 27) {
        this.clear();
        this.handleFocusOut();
      }
    }
  };
  
  @action
  clear() {
    this.searchTerms = '';
    this.onClear();
  };

  @action
  goTo(result) {
    this.addSearchToSearchHistory(result);

    const el = document.querySelector('.map-search-input');
    if (el) el.blur();

    result.searchQuery = this.searchTerms;

    this.selected = 0;
    this.searchTerms = result.label;
    this._focused = false;
    this.currResults = [];

    this.onSelect(result);
  };

  @action
  handleFocusIn() {
    this._focused = true;
  };

  @action
  handleHoverResult(result) {
    this.onHoverResult(result);
  };

  @action
  handleFocusOut() {
    this._focused = false;
  };

  @action
  handleHoverOut() {
    this.onHoverOut();
  };

  saveSearchHistory() {
    window.localStorage.setItem('search-history', JSON.stringify(
      this.searchHistory.slice(0, 100)
    ));
  };

  addSearchToSearchHistory(result) {
    if (this.useSearchHistory) {
      const h = [...this.searchHistory].filter(
        (search) => search.label !== result.label
      );
      this.searchHistory = [
        { ...result, typeTitle: 'Search History' },
        ...h,
      ];
      this.saveSearchHistory();
    }
  };

  @action
  removeSearchFromSearchHistory(result) {
    this.searchHistory =
      this.searchHistory.filter(
        (search) => search.label !== result.label
      );
    this.saveSearchHistory();
    this.currResults =
      this.currResults.filter((curr) => curr.label !== result.label);
  };

  @action
  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
    this.currResults = this.currResults.filter(
        (search) => search.typeTitle !== 'Search History'
      );
  };

  @action
  filterSearchHistory(query) {
    if (this.useSearchHistory) {
      this.filteredSearchHistory = this.searchHistory
        .filter((search) =>
          search.label.toUpperCase().includes(query.toUpperCase())
        )
        .slice(0, 5);
    }
  };
};
