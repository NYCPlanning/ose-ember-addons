'use strict';

module.exports = {
  name: require('./package').name,
  isDevelopingAddon() {
    return true;
  },
  options: {
    autoImport: {
      exclude: ['mapbox-gl'],
      webpack: {
        module: {
          rules: [
            {
              type: 'javascript/auto',
              test: /\.mjs$/,
              use: [],
            },
          ],
        },
      },
    },
    sassOptions: {
      includePaths: [
        'node_modules/foundation-sites/scss',
        'app/styles/nyc-planning-style-guide',
      ],
      sourceMapEmbed: true,
    },
  },
};
