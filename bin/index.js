import mongoose from 'mongoose'

import dbConf from './../config/mongodb'

import logger from './../lib/common/logger'
import mongo from './../lib/model/mongo'

import server from './../lib/server'

logger.info('get the server configuration...')

mongoose.Promise = global.Promise

mongoose.connect(dbConf.url, { useMongoClient: true })
.then(db => {
  mongo.config.findOne({}, (err, doc) => {
    if (err) {
      logger.error('server configuration read failed!', err)
      process.exit(1)
    } else {
      global.__conf = doc
      server.listen(8090, '0.0.0.0')
    }
  })
})

// async function asyncFunc () {
//   return 123
// }

// asyncFunc().then(i => { console.log(i) })
