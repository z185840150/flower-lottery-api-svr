/** response content maker */
const maker = {
  /**
   * making the response content.
   *
   * @param {any} res - response object.
   * @param {any} next - next function.
   * @param {any} data - content data.
   * @param {any} type - content format, default is json.
   */
  result (res, next, data, type = 'json') {
    res.sender = { type, status: 200, data }
    next()
  },
  /**
   * making the error response content.
   *
   * @param {any} res - response object.
   * @param {any} next - next function.
   * @param {any} error - error data.
   * @param {boolean} [log=true] - write a log?
   */
  error (res, next, error, log = true) {
    res.sender = { type: 'json', status: 500, data: { result: 500, errmsg: __dev ? error : '访问失败' } }
    next()
  },
  /**
   * making the unauth response content.
   *
   * @param {any} res - response object.
   * @param {any} next - next function.
   */
  unautho (res, next) {
    res.sender = { type: 'json', status: 401, data: { result: 401, errmsg: '无权限' } }
    next()
  }
}

module.exports = maker
