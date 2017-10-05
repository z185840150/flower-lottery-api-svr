const [express, validate] = [
  require('express'),
  require('express-validation')
]

const sender = require('./../helpers/responser/sender')

const ctrl = {
  admin: require('./../controllers/admin'),
  auth: require('./../controllers/auth')
}

const need = {
  admin: ctrl.auth.methods.need.admin
}

let router = express.Router()

router.route('/userlist').get(need.admin, validate(ctrl.admin.valid.userlist.get), ctrl.admin.methods.userlist, sender)
router.route('/logs/login').get(need.admin, validate(ctrl.admin.valid.logs.login.get), ctrl.admin.methods.logs.login, sender)

// 获取某Token的生命体征
router.route('/token/life').get(need.admin, validate(ctrl.admin.valid.token.life), ctrl.admin.methods.token.life, sender)

// 修改 网站配置
router.route('/edit/webinfo').post(need.admin, validate(ctrl.admin.valid.conf.webinfo), ctrl.admin.methods.conf.webinfo, sender)
module.exports = {
  path: 'admin',
  router
}
