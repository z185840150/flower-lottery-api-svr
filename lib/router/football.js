const [express, validate] = [
  require('express'),
  require('express-validation')
]

const sender = require('./../helpers/responser/sender')

const ctrl = {
  auth: require('./../controllers/auth'),
  football: require('./../controllers/football')
}

let router = express.Router()

router.route('/list/hhad').get(validate(ctrl.football.valid.list.hhad.get), ctrl.football.methods.list.hhad, sender)
router.route('/list/ttg').get(validate(ctrl.football.valid.list.hhad.get), ctrl.football.methods.list.ttg, sender)
router.route('/list/crs').get(validate(ctrl.football.valid.list.hhad.get), ctrl.football.methods.list.crs, sender)
module.exports = {
  path: 'football',
  router
}
