const clamp = require('./clamp')

/**
 * 数组内随机取一个元素
 *
 * @param {...any} array
 *
 * @returns {any}
 */
function inArray (array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 随机数字
 *
 * @param {Number} length 长度 (1~100)
 * @param {Boolean} getString 结果取字符串
 *
 * @returns {Number|String}
 */
function num (length, getString) {
  const num = str(length, '0123456789')

  return getString ? num : parseInt(num)
}

/**
 * 随机字符串
 *
 * @param {Number} length 长度 (1~100)
 * @param {String} chars 自定义组合
 *
 * @returns {String}
 */
function str (length, chars) {
  length = clamp.num(Number(length || 32), 1, 100)
  chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

  let charsLength = chars.length
  let data = ''
  for (let i = 0; i < length; i++) {
    data += chars.charAt(Math.floor(Math.random() * charsLength))
  }

  return data
}

module.exports = {
  inArray,
  num,
  str

}
