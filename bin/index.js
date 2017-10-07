import 'babel-polyfill'
import mongoose from 'mongoose'

import dbConf from './../config/mongodb'

const [logger, mongo] = [
  require('./../lib/common/logger'),
  require('./../lib/model/mongo')
]

async function asyncFunc () {
  return 123
}

asyncFunc().then(i => { console.log(i) })

const mime = require('mime')

console.log(mime.getType('jpg'))

logger.info('读取网站配置...')

mongoose.Promise = global.Promise
mongoose.connect(dbConf.url, { useMongoClient: true }).then(db => {
  mongo.config.findOne({}, (err, doc) => {
    if (err) {
      logger.error('网站配置读取失败', err)
      process.exit(1)
    } else {
      global.__conf = doc
      require('./../lib/server')
    }
  })
})
