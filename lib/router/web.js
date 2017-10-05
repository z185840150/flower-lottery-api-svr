const [express, validate] = [
  require('express'),
  require('express-validation')
]

const sender = require('./../helpers/responser/sender')

const ctrl = {
  auth: require('./../controllers/auth'),
  web: require('./../controllers/web')
}

let router = express.Router()

router.route('/info').get(ctrl.auth.methods.need.admin, validate(ctrl.web.valid.info.base.get), ctrl.web.methods.info.base, sender)
router.route('/info').post(ctrl.auth.methods.need.admin, validate(ctrl.web.valid.info.base.post), ctrl.web.methods.info.base, sender)
router.route('/info/friendlinks').post(ctrl.auth.methods.need.admin, validate(ctrl.web.valid.info.friendlinks.post), ctrl.web.methods.info.friendlinks, sender)
router.route('/info/friendlinks').delete(ctrl.auth.methods.need.admin, validate(ctrl.web.valid.info.friendlinks.delete), ctrl.web.methods.info.friendlinks, sender)
module.exports = {
  path: 'web',
  router
}
