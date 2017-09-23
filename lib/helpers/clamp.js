/**
 * 约束数字
 *
 * @param {Number} num 值
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 *
 * @returns {Number}
 */
function num (num, min, max) {
  return num > max ? max : num < min ? min : num
}

module.exports = {
  num
}
