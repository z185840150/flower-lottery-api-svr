const log4js = require('log4js')
const path = require('path')

log4js.configure(path.join(__dirname, `./../../../config/log4js.json`))

module.exports = log4js.getLogger('[SERVER]')
