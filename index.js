'use strict';

module.exports = {
  name: require('./package').name,
  isDevelopingAddon() {
    return true;
  },
  options: {
    autoImport: {
      exclude: ['mapbox-gl', 'ember-mapbox-gl'],
    },
    sassOptions: {
      includePaths: [
        'node_modules/foundation-sites/scss',
        'node_modules/nyc-planning-style-guide/dist/assets/scss',
      ],
      sourceMapEmbed: true,
    },
  },
};
