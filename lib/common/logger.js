import log4js from 'log4js'
import path from 'path'

log4js.configure(path.join(__dirname, './../../config/log4js.json'))

const logger = log4js.getLogger('[SERVER]')

export default logger
