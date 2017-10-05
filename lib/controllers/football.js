const [Joi, moment, request] = [
  require('joi'),
  require('moment'),
  require('request').defaults({maxRedirects: 20})
]

const [captcha, maker, mongo, random, redis] = [
  require('./../helpers/captcha'),
  require('./../helpers/responser/maker'),
  require('./../model/mongo'),
  require('./../helpers/random'),
  require('./../model/redis')
]

module.exports = {
  valid: {
    list: {
      hhad: {
        get: {
          query: { proportion: Joi.boolean().default(false) }
        }
      }
    }
  },
  methods: {
    list: {
      crs (req, res, next) {
        if (req.route.methods.get) {
          let url = req.query.proportion
          ? `http://i.sporttery.cn/odds_calculator/get_proportion?poolcode[]=hhad&poolcode[]=had&_=${moment().valueOf()}`
          : `http://i.sporttery.cn/odds_calculator/get_odds?poolcode[]=crs&_=${moment().valueOf()}`
          request({ method: 'GET', url, timeout: 8000, encoding: null }, (error, response, body) => {
            if (error) { maker.result(res, next, 'json', { result: 1001, errmsg: '获取失败' }) } else {
              let json = JSON.parse(body)
              if (json && json.data && typeof json.data === 'object' && Object.keys(json.data)) {
                maker.result(res, next, 'json', { result: 0, errmsg: '', data: json.data })
              }
            }
          })
        }
      },
      hhad (req, res, next) {
        if (req.route.methods.get) {
          let url = req.query.proportion
          ? `http://i.sporttery.cn/odds_calculator/get_proportion?poolcode[]=hhad&poolcode[]=had&_=${moment().valueOf()}`
          : `http://i.sporttery.cn/odds_calculator/get_odds?poolcode[]=hhad&poolcode[]=had&_=${moment().valueOf()}`
          request({ method: 'GET', url, timeout: 8000, encoding: null }, (error, response, body) => {
            if (error) { maker.result(res, next, 'json', { result: 1001, errmsg: '获取失败' }) } else {
              let json = JSON.parse(body)
              if (json && json.data && typeof json.data === 'object' && Object.keys(json.data)) {
                maker.result(res, next, 'json', { result: 0, errmsg: '', data: json.data })
              }
            }
          })
        }
      },
      ttg (req, res, next) {
        if (req.route.methods.get) {
          let url = req.query.proportion
          ? `http://i.sporttery.cn/odds_calculator/get_proportion?poolcode[]=hhad&poolcode[]=had&_=${moment().valueOf()}`
          : `http://i.sporttery.cn/odds_calculator/get_odds?poolcode[]=ttg&_=${moment().valueOf()}`
          request({ method: 'GET', url, timeout: 8000, encoding: null }, (error, response, body) => {
            if (error) { maker.result(res, next, 'json', { result: 1001, errmsg: '获取失败' }) } else {
              let json = JSON.parse(body)
              if (json && json.data && typeof json.data === 'object' && Object.keys(json.data)) {
                maker.result(res, next, 'json', { result: 0, errmsg: '', data: json.data })
              }
            }
          })
        }
      }
    }
  }
}
