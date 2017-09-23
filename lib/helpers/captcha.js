const Canvas = require('canvas')

function randomNum (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
function randomColor (min, max) {
  var r = randomNum(min, max)
  var g = randomNum(min, max)
  var b = randomNum(min, max)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

module.exports = _config => new Promise((resolve, reject) => {
  let config = Object.assign({
    text: null,
    size: 4,
    colorRange: [50, 160],
    backColorRange: [180, 250],
    width: 120,
    height: 40,
    transparent: true,
    noiseLineCount: 8,
    noiseLineColorRange: [40, 180],
    noisePointCount: 100
  }, _config)
  try {
    let canvas = new Canvas(config.width, config.height)
    let ctx = canvas.getContext('2d')

    // 绘制背景色
    ctx.fillStyle = config.transparent ? 'rgba(0,0,0,0)' : randomColor(config.backColorRange[0], config.backColorRange[1])
    ctx.fillRect(0, 0, config.width, config.height)

    // 绘制文字
    const str = 'ABCEFGHJKLMNPQRSTWXY123456789'
    /** 最终文本 */
    let finalText = config.text ? config.text : ''
    /** 文本长度 */
    let textLength = typeof config.text === 'string' ? config.text.length : config.size
    /** 文本区宽度 */
    let clientWidth = config.width - 20
    for (let i = 0; i < textLength; i++) {
      /** 文字尺寸 */
      let fontSize = randomNum(config.height / 2, config.height * 1.05)
      /** 文本 */
      let txt = typeof config.text === 'string' ? config.text[i] : str[randomNum(0, str.length)]

      ctx.fillStyle = randomColor(config.colorRange[0], config.colorRange[1])  // 随机生成字体颜色
      ctx.font = `${fontSize}px SimHei` // 随机生成字体大小

      let x = 10 + i * clientWidth / textLength
      let y = randomNum(45, 45)
      let deg = randomNum(-20, 20)

      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)

      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)

      if (!config.text) finalText += txt
    }
    /** 绘制干扰线**/
    for (let i = 0; i < config.noiseLineCount; i++) {
      ctx.strokeStyle = randomColor(config.noiseLineColorRange[0], config.noiseLineColorRange[1])
      ctx.beginPath()
      ctx.moveTo(randomNum(0, config.width), randomNum(0, config.height))
      ctx.lineTo(randomNum(0, config.width), randomNum(0, config.height))
      ctx.stroke()
    }
    /** 绘制干扰点**/
    for (let i = 0; i < config.noisePointCount; i++) {
      ctx.fillStyle = randomColor(0, 255)
      ctx.beginPath()
      ctx.arc(randomNum(0, config.width), randomNum(0, config.height), 1, 0, 2 * Math.PI)
      ctx.fill()
    }
    canvas.toBuffer((e, buf) => {
      if (e) throw e
      else resolve(buf, finalText)
    })
  } catch (e) {
    reject(e)
  }
})
