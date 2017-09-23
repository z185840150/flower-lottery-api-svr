const crypto = require('crypto')

/**
 * 转义字符串为Base64
 *
 * @param {String} str 字符串
 *
 * @returns {String}
 */
function base64 (str) {
  return Buffer.from(str).toString('base64')
}

/**
 * HMAC_SHA1 算法
 *
 * @param {String} str 字符串
 * @param {String|Buffer} key 密匙
 *
 * @returns {String}
 */
function hMacSha1 (str, key) {
  return crypto.createHmac('sha1', key).update(str).digest('hex')
}

/**
 * MD5 算法
 *
 * @param {String} str 字符串
 *
 * @returns {String}
 */
function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

/**
 * SHA1 算法
 *
 * @param {String} str 字符串
 *
 * @returns {String}
 */
function sha1 (str) {
  return crypto.createHash('sha1').update(str).digest('hex')
}

/**
 * SHA256 算法
 *
 * @param {String} str 字符串
 *
 * @returns {String}
 */
function sha256 (str) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

module.exports = { base64, hMacSha1, md5, sha1, sha256 }
