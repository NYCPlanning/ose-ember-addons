import { Promise } from 'rsvp';
import getConfiguration from '../configuration';

const cartoUsername = getConfiguration()['carto-username'] || 'planninglabs';
const cartoDomain = `${cartoUsername}.carto.com`;

const buildTemplate = function(cartoResponse, type) { // eslint-disable-line
  const { layergroupid, cdn_url } = cartoResponse; // eslint-disable-line
  const { subdomains } = cdn_url.templates.https;

  // choose a subdomain at random
  const subdomain = subdomains[Math.floor(Math.random() * subdomains.length)];

  return `${cdn_url.templates.https.url.replace(
    '{s}',
    subdomain
  )}/${cartoUsername}/api/v1/map/${layergroupid}/{z}/{x}/{y}.${type}`;
};

const buildSqlUrl = function(cleanedQuery, type = 'json') { // eslint-disable-line
  return `https://${cartoDomain}/api/v2/sql?q=${cleanedQuery}&format=${type}`;
};

const carto = {
  SQL(query, type = 'json') {
    const cleanedQuery = query.replace('\n', '');
    const url = buildSqlUrl(cleanedQuery, type);

    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Not found');
      })
      .then((d) => { // eslint-disable-line
        return type === 'json' ? d.rows : d;
      });
  },

  getVectorTileTemplate(sourceLayers) {
    const CartoCSS = '#layer { polygon-fill: #FFF; }';
    const layers = sourceLayers.map((sourceLayer) => {
      const { id, sql } = sourceLayer;
      return {
        id,
        type: 'mapnik',
        options: {
          cartocss_version: '2.3.0',
          cartocss: CartoCSS,
          sql,
        },
      };
    });

    const params = {
      version: '1.3.0',
      layers,
    };

    return new Promise((resolve, reject) => {
      fetch(`https://${cartoDomain}/api/v1/map`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
        .catch((err) => reject(err))
        .then((response) => response.json())
        .then((json) => {
          resolve(buildTemplate(json, 'mvt'));
        });
    });
  },
};

export { buildSqlUrl };
export default carto;
