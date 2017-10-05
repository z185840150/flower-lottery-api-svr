const [express, validate] = [
  require('express'),
  require('express-validation')
]

const sender = require('./../helpers/responser/sender')

const ctrl = {
  avatar: require('./../controllers/avatar')
}

let router = express.Router()

router.route('/').get(validate(ctrl.avatar.valid.base.get), ctrl.avatar.methods.base, sender)

module.exports = {
  path: 'avatar',
  router
}
