const mongoose = require('mongoose')

const [config, schemas] = [
  require('./../../config/mongodb'),
  require('./schema')
]

mongoose.Promise = global.Promise
mongoose.model('admin', schemas.admin, `${config.pr}sv_admin`)
mongoose.model('config', schemas.config, `${config.pr}sv_config`)
mongoose.model('logslogin', schemas.logslogin, `${config.pr}sv_logs_login`)

module.exports = {
  admin: mongoose.model('admin'),
  config: mongoose.model('config'),
  logslogin: mongoose.model('logslogin')
}
