const [express, validate] = [
  require('express'),
  require('express-validation')
]

const sender = require('./../helpers/responser/sender')

const ctrl = {
  auth: require('./../controllers/auth')
}

let router = express.Router()

router.route('/token/admin').get(ctrl.auth.methods.need.admin, ctrl.auth.methods.token.admin, sender)
router.route('/token/admin').post(validate(ctrl.auth.valid.token.admin.post), ctrl.auth.methods.token.admin, sender)
router.route('/token/admin').delete(ctrl.auth.methods.need.admin, ctrl.auth.methods.token.admin, sender)

module.exports = {
  path: 'auth',
  router
}
