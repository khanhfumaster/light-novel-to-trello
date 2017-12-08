import rp from 'request-promise';
import cheerio from 'cheerio';

function scrape(url) {
  return rp({
    url: url,
    transform: function (body) {
      return cheerio.load(body);
    }
  })
}

const CATALOG = {
  wuxiaworld: {
    url: 'http://wuxiaworld.com',
    selector: 'article > div.entry-content > div:nth-child(1) > div'
  },
  moonbunnycafe: {
    url: 'http://moonbunnycafe.com',
    selector: '.entry-content'
  }
};

function buildUrl(site, novelKey, chapterPrefix, chapter) {
  return `${CATALOG[site].url}/${novelKey}/${chapterPrefix}-${chapter}`;
}

function getChapter(site, novelKey, chapterPrefix, chapter) {
  if (CATALOG[site]) {
    return scrape(buildUrl(site, novelKey, chapterPrefix, chapter)) 
      .then($ => {
        return $(CATALOG[site].selector).text()
      });
  } else {
    throw new Error(`Invalid site: ${site}`)
  }
}

export default getChapter;