const [Joi, jwt, moment] = [
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
    admintoken: {
      post: {
        body: {
          username: Joi.string().alphanum().min(4).max(30).required(),
          password: Joi.string().alphanum().length(32).required(),
          capcha_code: Joi.string().alphanum().min(4).max(16).required()
        },
        query: {
          capcha_key: Joi.string().alphanum().length(16).required(),
          life: Joi.number().integer().min(15).max(60 * 24 * 7).default(15) // 单位 分钟
        }
      },
      get: {
        body: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  },
  methods: {
    admintokencheck (req, res, next) {
      const token = req.headers['x-access-token']

      if (token) {
        redis.get(`token_${token}`, (err, value) => {
          if (err || !value) {
            maker.unautho(res, next)
          } else {
            let _value = JSON.parse(value)
            redis.set(`token_${token}`, value, 'EX', _value.life, () => {
              res.auth = _value
              next()
            })
          }
        })
      }
    },
    admintokenchecksuccess (req, res, next) {
      if (res.auth) {
        maker.result(res, next, 'json', { result: 0, errmsg: '' })
      } else next()
    },
    admintoken (req, res, next) {
      if (req.route.methods.post) {
        redis.get(`captcha_${req.query.capcha_key}`, (err, value) => {
          if (err || !value || value.toLocaleLowerCase() !== req.body.capcha_code.toLocaleLowerCase()) maker.result(res, next, 'json', { result: 1001, errmsg: '验证码错误' })
          else {
            redis.del(`captcha_${req.query.capcha_key}`, (err, result) => {
              if (err) maker.result(res, next, 'json', { result: 1001, errmsg: '验证码错误' })
              else {
                mongo.admin.findOne({ username: req.body.username })
                .then(doc => {
                  if (doc) {
                    if (crypto.md5(req.body.password + doc.salt) === doc.password) {
                      const iss = '1.0' // (Issuer) Token 签发者
                      const sub = doc.id // (Subject) Token 服务的对象
                      const iat = moment().valueOf() // Token 签发时间
                      const exp = moment().add(req.query.life, 'm').valueOf() // Token 过期时间

                      let token = jwt.encode({ iss, sub, iat, exp }, 'flower lottery')
                      // 记录至数据库
                      mongo.logslogin.create({
                        uid: doc.id,
                        u_type: 'admin',
                        time: new Date(),
                        ip: req.headers['x-forwarded-for'] ||
                          req.connection.remoteAddress ||
                          req.socket.remoteAddress ||
                          req.connection.socket.remoteAddress,
                        ip_address: '未知',
                        token
                      })
                      // 缓存 token
                      redis.set(`token_${token}`, JSON.stringify({
                        uid: doc.id,
                        life: req.query.life * 60
                      }), 'EX', req.query.life * 60, () => {
                        maker.result(res, next, 'json', { result: 0, token })
                      })
                    } else maker.result(res, next, 'json', { result: 1003, errmsg: '密码错误' })
                  } else maker.result(res, next, 'json', { result: 1002, errmsg: '管理员不存在' })
                })
              }
            })
          }
        })
      }
    }
  }
}
