const [http, Joi, jwt, moment] = [
  require('http'),
  require('joi'),
  require('jwt-simple'),
  require('moment')
]

const [crypto, maker, mongo, redis] = [
  require('./../helpers/crypto'),
  require('./../helpers/responser/maker'),
  require('./../model/mongo'),
  require('./../model/redis')
]

module.exports = {
  valid: {
    token: {
      admin: {
        post: {
          body: {
            username: Joi.string().alphanum().min(4).max(30).required(),
            password: Joi.string().alphanum().length(32).required(),
            capcha_code: Joi.string().alphanum().min(4).max(16).required()
          },
          query: {
            capcha_key: Joi.string().alphanum().length(16).required(),
            life: Joi.number().integer().min(15 * 60).max(60 * 60 * 24 * 7).default(15 * 60) // 秒
          }
        }
      }
    }
  },
  methods: {
    need: {
      /**
       * 检测 管理员权限授权
       *
       * @param {any} req
       * @param {any} res
       * @param {any} next
       */
      admin (req, res, next) {
        let token = req.headers['x-access-token']

        if (token) {
          redis.get(`token_admin_${token}`, (err, value) => {
            if (err || !value) maker.unautho(res, next)
            else {
              let _value = JSON.parse(value)
              redis.set(`token_admin_${token}`, value, 'EX', _value.life, () => {
                res.auth = _value
                next()
              })
            }
          })
        } else maker.unautho(res, next)
      },
      /**
       * 检测用户权限授权
       *
       * @param {any} req
       * @param {any} res
       * @param {any} next
       */
      user (req, res, next) {
        let token = req.headers['x-access-token']
        if (token) {
          redis.get(`token_user_${token}`, (err, value) => {
            if (err || !value) maker.unautho(res, next)
            else {
              let _value = JSON.parse(value)
              redis.set(`token_user_${token}`, value, 'EX', _value.life, () => {
                res.auth = _value
                next()
              })
            }
          })
        } else maker.unautho(res, next)
      }
    },
    token: {
      admin (req, res, next) {
        if (req.route.methods.post) { // 获取 Token
          redis.get(`captcha_${req.query.capcha_key}`, (e, val) => {
            // 验证码校验
            if (e || !val || typeof val !== 'string' || val.toLocaleLowerCase() !== req.body.capcha_code.toLocaleLowerCase()) {
              maker.result(res, next, 'json', { result: 1001, errmsg: '验证码错误' })
            } else {
              redis.del(`captcha_${req.query.capcha_key}`) // 删除缓存验证码
              mongo.admin.findOne({ username: req.body.username }).then(doc => {
                if (doc && typeof doc === 'object') { // 判断文档
                  if (crypto.md5(req.body.password + doc.salt) === doc.password) { // 判断密码
                    let iss = '1.0' // (Issuer) Token 签发者
                    let sub = doc.id // (Subject) Token 服务的对象
                    let iat = moment().valueOf() // Token 签发时间戳
                    let exp = moment().add(req.query.life, 's').valueOf() // Token 过期时间戳

                    let token = jwt.encode({ iss, sub, iat, exp }, 'flower lottery') // 生成 Token
                    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
                    let add = { country: '', area: '', region: '', city: '', county: '', isp: '' }
                    let _req = http.request({ hostname: 'ip.taobao.com', port: 80, path: `/service/getIpInfo.php?ip=${ip}`, method: 'GET' }, _res => {
                      _res.setEncoding('utf8')
                      _res.on('data', chunk => {
                        let json = JSON.parse(chunk)
                        if (json.code === 0) savlog({ country: json.data.country, area: json.data.area, region: json.data.region, city: json.data.city, county: json.data.county, isp: json.data.isp })
                        else savlog()
                      })
                    })
                    _req.on('error', e => { savlog() })
                    _req.end()

                    // 记录到数据库日志
                    const savlog = (address = add) => {
                      mongo.logslogin.create({ aid: doc.id, admin: true, time: new Date(), ip, ip_address: address, token, birthLife: req.query.life })
                    }
                    // 缓存 Token
                    redis.set(`token_admin_${token}`, JSON.stringify({
                      // uid: doc.id,
                      aid: doc.id,
                      life: req.query.life
                    }), 'EX', req.query.life, () => { maker.result(res, next, 'json', { result: 0, token, admin: true, aid: doc.id }) })
                  } else maker.result(res, next, 'json', { result: 1003, errmsg: '密码错误' })
                } else maker.result(res, next, 'json', { result: 1002, errmsg: '账号不存在' })
              })
            }
          })
        } else if (req.route.methods.get) { // 获取 Token 合法性
          if (res.auth) maker.result(res, next, 'json', { result: 0, errmsg: '' })
          else next()
        } else if (req.route.methods.delete) { // 注销 Token
          if (res.auth) {
            redis.del(`token_admin_${req.headers['x-access-token']}`)
            maker.result(res, next, 'json', { result: 0, errmsg: '' })
          } else next()
        }
      },
      user (req, res, next) {
        if (req.route.methods.get) { // 获取 Token 合法性
          if (res.auth) maker.result(res, next, 'json', { result: 0, errmsg: '' })
          else next()
        } else if (req.route.methods.post) { // 获取 Token
          redis.get(`captcha_${req.query.capcha_key}`, (e, val) => {
            if (e || !val || typeof val !== 'string' || val.toLocaleLowerCase() !== req.body.capcha_code.toLocaleLowerCase()) { // 验证码校验
              maker.result(res, next, 'json', { result: 1001, errmsg: '验证码错误' })
            } else {
              redis.del(`captcha_${req.query.capcha_key}`) // 删除缓存验证码
              mongo.user.findOne({ username: req.body.username }).then(doc => {
                if (doc && typeof doc === 'object') { // 判断文档
                  if (crypto.md5(req.body.password + doc.salt) === doc.password) { // 判断密码
                    let iss = '1.0' // (Issuer) Token 签发者
                    let sub = doc.id // (Subject) Token 服务的对象
                    let iat = moment().valueOf() // Token 签发时间戳
                    let exp = moment().add(req.query.life, 's').valueOf() // Token 过期时间戳

                    let token = jwt.encode({ iss, sub, iat, exp }, 'flower lottery') // 生成 Token
                    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
                    let add = { country: '', area: '', region: '', city: '', county: '', isp: '' }
                    let _req = http.request({ hostname: 'ip.taobao.com', port: 80, path: `/service/getIpInfo.php?ip=${ip}`, method: 'GET' }, _res => {
                      _res.setEncoding('utf8')
                      _res.on('data', chunk => {
                        let json = JSON.parse(chunk)
                        if (json.code === 0) savlog({ country: json.data.country, area: json.data.area, region: json.data.region, city: json.data.city, county: json.data.county, isp: json.data.isp })
                        else savlog()
                      })
                    })

                    _req.on('error', e => { savlog() })
                    _req.end()

                    // 记录到数据库日志
                    const savlog = (address = add) => {
                      mongo.logslogin.create({ uid: doc.id, admin: false, time: new Date(), ip, ip_address: address, token, birthLife: req.query.life })
                    }

                    // 缓存 Token
                    redis.set(`token_user_${token}`, JSON.stringify({
                      // uid: doc.id,
                      aid: doc.id,
                      life: req.query.life
                    }), 'EX', req.query.life, () => { maker.result(res, next, 'json', { result: 0, token, admin: false, uid: doc.id }) })
                  } else maker.result(res, next, 'json', { result: 1003, errmsg: '密码错误' })
                } else maker.result(res, next, 'json', { result: 1002, errmsg: '账号不存在' })
              })
            }
          })
        } else if (req.route.methods.delete) { // 注销 Token
          if (res.auth) {
            redis.del(`token_user_${req.headers['x-access-token']}`)
            maker.result(res, next, 'json', { result: 0, errmsg: '' })
          } else next()
        }
      }
    }
  }
}
