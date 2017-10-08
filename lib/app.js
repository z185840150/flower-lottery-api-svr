import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Express from 'express'
import ExpressRateLimit from 'express-rate-limit'
import fs from 'fs'
import path from 'path'
import RedisStore from 'rate-limit-redis'

import logger from './common/logger'
import redis from './model/redis'

const app = Express()

app.use(bodyParser.json({ limit: '512kb' })) // parsing application/json
app.use(bodyParser.urlencoded({ extended: false })) // parsing application/x-www-form-urlencoded
app.use(cookieParser())

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }))
app.use(new ExpressRateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: __conf.safe.rate.windowMs,
  delayAfter: __conf.safe.rate.delayAfter,
  delayMs: __conf.safe.rate.delayMs,
  max: __conf.safe.rate.max,
  message: '429',
  onLimitReached: (req, res, options) => {
    logger.warn(`ip ${req.ip} client access the ${req.route.path} interface in a short time`)
  }
}))
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, x-access-token, Cross-Origin')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  res.header('X-Powered-By', '1.0.0.1')
  next()
})
app.use('/api/doc', Express.static('lib/public'))
app.use('/api/static/wallpaper', Express.static('lib/static/wallpaper'))
fs.readdirSync(path.join(__dirname, './router')).forEach(file => {
  if (['.DS_Store', '.git', '.svn', '.hg'].indexOf(file) === -1 &&
    path.extname(file).toString().toLocaleLowerCase() === '.js') {
    let route = require('./router/' + file)
    // route.router.prepareSocketIO && app.ioReady.push(route.router.prepareSocketIO)
    app.use(`/api/${route.path}`, route.router)
  }
})
/*
app.use((req, res, next) => {
  let err = new Error('404 Not Found')
  res.status = 404
  next(err)
})

app.use((err, req, res) => {
  if (err instanceof require('express-validation').ValidationError) return res.status(err.status).json(err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)

  console.log(err)
  res.end('error')
})
*/
export default app
