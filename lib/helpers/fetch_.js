const fetch_ = {
  json (url) {
    return fetch(url)
    .then(request => request.text())
    .then(text => JSON.parse(text))
    .catch(e => { console.log(`Error: ${e.stack}`) })
  }
}

module.exports = fetch_
