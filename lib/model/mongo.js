import mongoose from 'mongoose'

import dbConf from './../../config/mongodb'
import schemas from './schema'

mongoose.Promise = global.Promise

mongoose.model('admin', schemas.admin, `${dbConf.pr}sv_admin`)
mongoose.model('config', schemas.config, `${dbConf.pr}sv_config`)
mongoose.model('files', schemas.files, `${dbConf.pr}sv_files`)
mongoose.model('friendLinks', schemas.friendLinks, `${dbConf.pr}sv_friendlinks`)
mongoose.model('logslogin', schemas.logslogin, `${dbConf.pr}sv_logs_login`)
mongoose.model('user', schemas.user, `${dbConf.pr}sv_user`)
mongoose.model('userFiles', schemas.userFiles, `${dbConf.pr}sv_user_files`)

module.exports = {
  admin: mongoose.model('admin'),
  config: mongoose.model('config'),
  files: mongoose.model('files'),
  friendLinks: mongoose.model('friendLinks'),
  logslogin: mongoose.model('logslogin'),
  user: mongoose.model('user'),
  userFiles: mongoose.model('userFiles')
}
