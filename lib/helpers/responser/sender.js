const [mime, xml2js] = [
  require('mime'),
  require('xml2js')
]

const send = {
  html (res, data) {
    res.setHeader('Content-Type', `${mime.lookup('html')};charset=utf-8`)
    res.end(data)
  },
  jpeg (res, data) {
    res.setHeader('Content-Type', 'image/jpeg')
    res.end(data)
  },
  json (res, data) {
    res.setHeader('Content-Type', 'application/json')
    res.json(data)
  },
  xml (res, data) {
    res.setHeader('Content-Type', mime.lookup('xml'))
    res.end(data)
  },
  png (res, data) {
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Length', data.length)
    res.end(data)
  },
  svg (res, data) {
    res.setHeader('Content-Type', mime.lookup('svg'))
    res.send(data)
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
    case 'jpg': case 'jpeg':
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
