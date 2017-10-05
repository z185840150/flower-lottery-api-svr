const mongoose = require('mongoose')

const [config, schemas] = [
  require('./../../config/mongodb'),
  require('./schema')
]

mongoose.Promise = global.Promise
mongoose.model('admin', schemas.admin, `${config.pr}sv_admin`)
mongoose.model('config', schemas.config, `${config.pr}sv_config`)
mongoose.model('files', schemas.files, `${config.pr}sv_files`)
mongoose.model('friendLinks', schemas.friendLinks, `${config.pr}sv_friendlinks`)
mongoose.model('logslogin', schemas.logslogin, `${config.pr}sv_logs_login`)
mongoose.model('user', schemas.user, `${config.pr}sv_user`)
mongoose.model('userFiles', schemas.userFiles, `${config.pr}sv_user_files`)

module.exports = {
  admin: mongoose.model('admin'),
  config: mongoose.model('config'),
  files: mongoose.model('files'),
  friendLinks: mongoose.model('friendLinks'),
  logslogin: mongoose.model('logslogin'),
  user: mongoose.model('user'),
  userFiles: mongoose.model('userFiles')
}
