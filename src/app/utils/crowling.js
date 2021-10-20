var Scraper = require('images-scraper');
// import * as Scraper from 'images-scraper';
const google = new Scraper({
  puppeteer: {
    headless: false,
  },
});

(async () => {
  const results = await google.scrape('forest', 60);
  console.log('results', results);
})();
/*
var Scraper = require('images-scraper');

const google = new Scraper({
  puppeteer: {
    headless: false,
  },
});

var fruits = ['house', 'animal', 'mountain', 'tree'](async () => {
  const results = await google.scrape(fruits, 100);
  console.log('results', results);
})();
*/
