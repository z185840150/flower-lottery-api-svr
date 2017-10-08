import mongoose from 'mongoose'

import dbConf from './../config/mongodb'

import logger from './../lib/common/logger'
import mongo from './../lib/model/mongo'
import process_ from './../lib/helpers/process_'

logger.info('get the server configuration...')

process_.findByPort(8090).then(p => {
  if (p && p.cmd === 'node') {
    logger.info('port has been used, cleared...')
    process_.killByPid(p.pid).then(res => {
      logger.info('clean up the port occupancy program')
    })
  }
})

mongoose.Promise = global.Promise
mongoose.connect(dbConf.url, { useMongoClient: true })
.then(db => {
  mongo.config.findOne({}, (err, doc) => {
    if (err) {
      logger.error('server configuration read failed!', err)
      process.exit(1)
    } else {
      global.__conf = doc
      logger.info('server configuration is successful!')
      require('./../lib/server')
    }
  })
})

// async function asyncFunc () {
//   return 123
// }

// asyncFunc().then(i => { console.log(i) })
