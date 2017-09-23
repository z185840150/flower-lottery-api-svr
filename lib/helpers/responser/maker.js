module.exports = {
  result: (res, next, type, data) => {
    res.sender = {
      type,
      status: 200,
      data
    }
    next()
  },
  error: (res, next, error, log = true) => {
    res.sender = {
      type: 'json',
      status: 500,
      data: __dev ? {errmsg: '访问失败', error} : {errmsg: '访问失败'}
    }
    next()
  },
  unautho: (res, next) => {
    res.sender = {
      type: 'json',
      status: 401,
      data: { result: 401, errmsg: '无权限' }
    }
    next()
  }
}
