const [express, validate] = [
  require('express'),
  require('express-validation')
]

const sender = require('./../helpers/responser/sender')

const ctrl = {
  auth: require('./../controllers/auth')
}

let router = express.Router()

router.route('/token').get(ctrl.auth.methods.admintokencheck, ctrl.auth.methods.admintokenchecksuccess, sender)
router.route('/token').post(validate(ctrl.auth.valid.admintoken.post), ctrl.auth.methods.admintoken, sender)

module.exports = {
  path: 'admin',
  router
}
