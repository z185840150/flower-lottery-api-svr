const log4js = require('log4js')
const path = require('path')

log4js.configure(path.join(__dirname, './../../../config/log4js.json'))

const logger = log4js.getLogger('[SERVER]')

export default logger
