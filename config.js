const config = require('config');

const dbConfig = config.get('Customer.dbConfig');
console.log(dbConfig);

if (config.has('optionalFeature.detail')) {
  const detail = config.get('optionalFeature.detail');
  console.log(detail);
}
