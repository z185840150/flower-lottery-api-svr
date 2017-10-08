import http from 'http'

import app from './app'
import logger from './common/logger'

Object.assign(global, { __sockets: {} })

const server = http.createServer(app)
server.listen(8090, '0.0.0.0')
// app.ioReady.forEach(socket => { socket(server) })

server.on('listening', () => { logger.info('server is listening on port 8090') })

server.on('error', err => {
  if (err.syscall !== 'listen') throw err

  let bind = `${typeof port === 'string' ? 'pipe' : 'port'} 8090`

  switch (err.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges, ${err}`)
      process.exit(1)
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use, ${err}`)
      process.exit(1)
    default: throw err
  }
})

export default server
