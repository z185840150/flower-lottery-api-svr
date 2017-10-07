import http from 'http'

import app from './app'
import logger from './common/logger'

Object.assign(global, { __sockets: {} })

const server = http.createServer(app)

// app.ioReady.forEach(socket => { socket(server) })

server.on('listening', () => { logger.info('server is listening on port 8090') })

server.on('error', err => {
  if (err.syscall !== 'listen') throw err

  let bind = `${typeof port === 'string' ? 'Pipe' : 'Port'} port`

  switch (err.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges, err: ${err}`)
      process.exit(1)
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use, err: ${err}`)
      process.exit(1)
    default: throw err
  }
})

export default server
