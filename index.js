const request = require('request')
const qs = require('querystring')

const BASE_URL = 'http://www.omdbapi.com/'

const OPTS_DEFAULT = {
  r: 'json',
  plot: 'short',
  t: null,
}

module.exports = {
  keyword: 'omdb',
  helper: {
    title: 'omdb',
    subtitle: 'Find a movie you\'re curious about',
  },
  query: q => new Promise(resolve => {
    const searchObj = Object.assign({}, OPTS_DEFAULT, { t: q })
    const searchParams = qs.stringify(searchObj)
    const url = `${BASE_URL}?${searchParams}`
    request.get({ url }, (err, responseObj, body) => {
      if (err) { resolve({ items: [] }); return }

      const response = JSON.parse(body)
      if (!isTruthyResponse(response)) {
        resolve({ items: [] })
        return
      }

      const resultItem = {
        title: response.Title,
        // @TODO: Truncate the Plot when it is long
        subtitle: `${response.imdbRating} - ${response.Plot}`,
        arg: `http://imdb.com/title/${response.imdbID}`,
      }
      resolve({ items: [resultItem] })
    })
  }),
  render: {
    type: 'html',
    render,
  },
}

function render (item) {
  // @TODO: Add more info into the panel
  return `
    <h3>${item.Title}</h3>
    <p>${item.Plot}</p>
  `
}

function isTruthyResponse ({ Response }) {
  return Response === 'True'
}
