import Component from '@ember/component';
import { computed } from '@ember/object'; // eslint-disable-line
import { timeout, task } from 'ember-concurrency';
import { getOwner } from '@ember/application';
import { Promise } from 'rsvp';

const DEBOUNCE_MS = 100;

export default Component.extend({
  init() {
    this._super(...arguments);

    const {
      host = 'https://search-api-production.herokuapp.com',
      route = 'search',
      helpers = ['geosearch', 'city-map-street-search', 'city-map-alteration'],
    } = getOwner(this).resolveRegistration('config:environment')[
      'labs-search'
    ] || {};

    this.setProperties({
      typeTitleLookup: {
        lot: 'Lot',
      },
      currResults: [],
      host: host,
      route: route,
      helpers: helpers,
    });
  },

  classNames: ['labs-geosearch'],

  onSelect() {},

  onHoverResult() {},

  onHoverOut() {},

  onClear() {},

  results: computed('debouncedResults', 'searchTerms', function () {
    const searchTerms = this.searchTerms;

    return this.debouncedResults.perform(searchTerms);
  }),

  resultsCount: computed('results.value', function () {
    const results = this.get('results.value');
    if (results) return results.length;
    return 0;
  }),

  endpoint: computed('helpers', 'host', 'route', 'searchTerms', function () {
    const searchTerms = this.searchTerms;
    const host = this.host;
    const route = this.route;
    const helpers = this.helpers
      .map((string) => `helpers[]=${string}&`)
      .join('');

    return `${host}/${route}?${helpers}q=${searchTerms}`;
  }),

  searchHistory: window.localStorage["search-history"] ? JSON.parse(window.localStorage["search-history"]) : [],

  searchPlaceholder: 'Search...',
  searchTerms: '',
  selected: 0,
  _focused: false,

  loading: null,

  filteredSearchHistory: [],

  debouncedResults: task(function* (searchTerms) {
    this.send('filterSearchHistory', searchTerms)
    if (searchTerms.length < 2) {
      this.set('currResults', this.filteredSearchHistory);
      return;
    }
    yield timeout(DEBOUNCE_MS);
    const URL = this.endpoint;

    this.set(
      'loading',
      new Promise(function (resolve) {
        setTimeout(resolve, 500);
      })
    );

    const raw = yield fetch(URL);
    const resultList = yield raw.json();
    const mergedWithTitles = resultList.map((result, index) => {
      const mutatedResult = result;
      mutatedResult.id = index;
      mutatedResult.typeTitle =
        this.get(`typeTitleLookup.${result.type}`) || 'Result';
      return mutatedResult;
    });

    this.set('currResults', this.filteredSearchHistory.concat(mergedWithTitles));
    this.set('loading', null);

    return mergedWithTitles;
  }).keepLatest(),

  keyPress(event) {
    const selected = this.selected;
    const { keyCode } = event;

    // enter
    if (keyCode === 13) {
      const results = this.get('results.value');
      if (results && results.get('length')) {
        const selectedResult = results.objectAt(selected);
        this.send('goTo', selectedResult);
      }
    }
  },

  keyUp(event) {
    const selected = this.selected;
    const resultsCount = this.resultsCount;
    const { keyCode } = event;

    const incSelected = () => {
      this.set('selected', selected + 1);
    };
    const decSelected = () => {
      this.set('selected', selected - 1);
    };

    if ([38, 40, 27].includes(keyCode)) {
      const results = this.get('results.value');

      // up
      if (keyCode === 38) {
        if (results) {
          if (selected > 0) decSelected();
        }
      }

      // down
      if (keyCode === 40) {
        if (results) {
          if (selected < resultsCount - 1) incSelected();
        }
      }

      // escape
      if (keyCode === 27) {
        this.send('clear');
        this.send('handleFocusOut');
      }
    }
  },

  actions: {
    clear() {
      this.set('searchTerms', '');
      this.onClear();
    },

    goTo(result) {
      this.send('addSearchToSearchHistory', result)
      const el = document.querySelector('.map-search-input');
      const event = document.createEvent('HTMLEvents');
      event.initEvent('blur', true, false);
      el.dispatchEvent(event);

      result.searchQuery = this.get('searchTerms');

      this.setProperties({
        selected: 0,
        searchTerms: result.label,
        _focused: false,
        currResults: [],
      });

      this.onSelect(result);
    },

    handleFocusIn() {
      this.set('_focused', true);
    },

    handleHoverResult(result) {
      this.onHoverResult(result);
    },

    handleFocusOut() {
      this.set('_focused', false);
    },

    handleHoverOut() {
      this.onHoverOut();
    },

    saveSearchHistory() {
      window.localStorage["search-history"] = JSON.stringify(this.searchHistory.slice(0, 100))
    },

    addSearchToSearchHistory(result) {
      const h = [...this.searchHistory].filter((search) => search.label !== result.label);
      this.set('searchHistory', [{...result, typeTitle: "Search History"}, ...h]);
      this.send('saveSearchHistory');
    },

    removeSearchFromSearchHistory(result) {
      this.set('searchHistory', [...this.searchHistory].filter((search) => search.label !== result.label));
      this.send('saveSearchHistory');
      this.set('currResults', [...this.currResults].filter((curr) => curr.label !== result.label));
    },

    clearSearchHistory() {
      this.set('searchHistory', []);
      this.send('saveSearchHistory');
      this.set('currResults', [...this.currResults].filter((search) => search.typeTitle !== "Search History"))
    },

    filterSearchHistory(query) {
      const h = [...this.searchHistory].filter((search) => search.label.toUpperCase().includes(query.toUpperCase())).slice(0, 5);
      this.set('filteredSearchHistory', h)
    },   
  },
});
