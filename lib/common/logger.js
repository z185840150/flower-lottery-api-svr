const [log4js, path] = [
  require('log4js'),
  require('path')]

log4js.configure(path.join(__dirname, `./../../config/log4js.json`))

module.exports = log4js.getLogger('[SERVER]')
