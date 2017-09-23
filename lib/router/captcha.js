const [express, validate] = [
  require('express'),
  require('express-validation')
]

const sender = require('./../helpers/responser/sender')

const ctrl = {
  captcha: require('./../controllers/captcha')
}

let router = express.Router()

router.route('/').get(validate(ctrl.captcha.valid.get), ctrl.captcha.methods.captcha, sender)

module.exports = {
  path: 'captcha',
  router
}
