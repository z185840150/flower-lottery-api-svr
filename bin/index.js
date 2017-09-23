const mongoose = require('mongoose')

const [mongodbConfig, logger, mongo] = [
  require('./../config/mongodb'),
  require('./../lib/common/logger'),
  require('./../lib/model/mongo')
]

logger.info('读取网站配置...')

mongoose.Promise = global.Promise
mongoose.connect(mongodbConfig.url, { useMongoClient: true }).then(db => {
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
