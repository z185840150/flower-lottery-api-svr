const [mime, xml2js] = [
  require('mime'),
  require('xml2js')
]

/** @type {object} - send content methods */
const send = {
  /**
   * response send html content data
   *
   * @param {any} res - response object
   * @param {any} data - content data
   */
  html (res, data) {
    res.setHeader('Content-Type', `${mime.getType('html')}; charset=utf-8`)
    res.end(data)
  },
  /**
   * response send jpg image content data
   *
   * @param {any} res - response object
   * @param {any} data - content data
   */
  jpeg (res, data) {
    res.setHeader('Content-Type', `${mime.getType('jpg')}`)
    res.end(data)
  },
  /**
   * response send json object content data
   *
   * @param {any} res - response object
   * @param {any} data - content data
   */
  json (res, data) {
    res.setHeader('Content-Type', `${mime.getType('json')}`)
    res.json(data)
  },
  /**
   * response send png image content data
   *
   * @param {any} res - response object
   * @param {any} data - content data
   */
  png (res, data) {
    res.setHeader('Content-Type', `${mime.getType('png')}`)
    res.setHeader('Content-Length', data.length)
    res.end(data)
  },
  /**
   * response send svg image content data
   *
   * @param {any} res - response object
   * @param {any} data - content data
   */
  svg (res, data) {
    res.setHeader('Content-Type', `${mime.getType('svg')}`)
    res.send(data)
  },
  /**
   * response send xml content data
   *
   * @param {any} res - response object
   * @param {any} data - content data
   */
  xml (res, data) {
    res.setHeader('Content-Type', `${mime.getType('xml')}`)
    res.end(data)
  }
}

module.exports = function (req, res, next) {
  /** @type {string} - response data */
  let senderData = res.sender.data
  /** @type {string} - response data type */
  let senderDataType = (res.sender.type || 'json').toLocaleLowerCase()
  /** @type {string} - request data type */
  let requestDataType = (req.query.type || res.sender.type).toLocaleLowerCase()

  res.status(res.sender.status || 200)

  switch (senderDataType) {
    case 'html': send.html(res, senderData); break
    case 'jpeg': case 'jpe': case 'jpg':
      switch (requestDataType) {
        default: send.jpeg(res, senderData)
      }
      break
    case 'json':
      switch (requestDataType) {
        case 'xml': send.xml(res, new xml2js.Builder().buildObject(senderData)); break
        default: send.json(res, senderData)
      }
      break
    case 'png':
      switch (requestDataType) {
        default: send.png(res, senderData)
      }
      break
    case 'svg':
      switch (requestDataType) {
        default: send.svg(res, senderData)
      }
      break
    case 'xml':
      switch (requestDataType) {
        case 'json': xml2js.parseString(senderData, (err, json) => { if (err) send.xml(res, senderData); else send.json(res, json) }); break
        default: send.xml(res, senderData)
      }
      break
    default: res.end(senderData)
  }
}
