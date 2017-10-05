const [Joi] = [
  require('joi')
]

const [captcha, maker, random, redis] = [
  require('./../helpers/captcha'),
  require('./../helpers/responser/maker'),
  require('./../helpers/random'),
  require('./../model/redis')
]

module.exports = {
  valid: {
    get: {
      query: {
        key: Joi.string().alphanum().min(4).max(16).default('__getter__'),
        bg: Joi.boolean().default(true)
      }
    }
  },
  methods: {
    captcha (req, res, next) {
      if (req.route.methods.get) {
        if (req.query.key === '__getter__') { // 获取验证码 Key
          let key = random.str(16)
          let code = random.str(4)

          redis.set(`captcha_${key}`, code, 'EX', 60 * 2, () => { maker.result(res, next, 'json', { result: 0, errmsg: '', key }) })
        } else { // 获取验证码图像
          // 读取 redis 缓存
          redis.get(`captcha_${req.query.key}`, (err, value) => {
            if (err || !value) maker.result(res, next, 'json', { result: 1001, errmsg: '验证码获取失败' })
            else {
              captcha({ text: value, transparent: req.query.bg })
              .then((buffer, text) => { maker.result(res, next, 'png', buffer) })
              .catch(e => { maker.error(res, next, e, true) })
            }
          })
        }
      }
    }
  }
}
