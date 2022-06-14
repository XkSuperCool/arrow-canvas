let beginPoint = {}
let stopPoint = {}
let polygonVertex = []

let CONST = {
  edgeLen: 50, // 箭头的头部长度
  angle: 30 // 箭头的头部角度
}

function paraDef(edgeLen, angle) {
  CONST.edgeLen = edgeLen
  CONST.angle = angle
}

// 封装的作图对象
let Plot = {
  angle: '',

  dynArrowSize() {
    let x = stopPoint.x - beginPoint.x
    let y = stopPoint.y - beginPoint.y
    let length = Math.sqrt(x ** 2 + y ** 2)

    if (length < 50) {
      CONST.edgeLen = length / 2
    } else if (length < 250) {
      CONST.edgeLen /= 2
    } else if (length < 500) {
      CONST.edgeLen = (CONST.edgeLen * length) / 500
    }
  },

  // getRadian 返回以起点与X轴之间的夹角角度值
  getRadian(beginPoint, stopPoint) {
    Plot.angle =
      (Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) /
        Math.PI) *
      180

    paraDef(50, 30)
    Plot.dynArrowSize()
  },

  // /获得箭头底边两个点
  arrowCoord(beginPoint, stopPoint) {
    polygonVertex[0] = beginPoint.x
    polygonVertex[1] = beginPoint.y
    polygonVertex[6] = stopPoint.x
    polygonVertex[7] = stopPoint.y
    Plot.getRadian(beginPoint, stopPoint)
    polygonVertex[8] =
      stopPoint.x -
      CONST.edgeLen * Math.cos((Math.PI / 180) * (Plot.angle + CONST.angle))
    polygonVertex[9] =
      stopPoint.y -
      CONST.edgeLen * Math.sin((Math.PI / 180) * (Plot.angle + CONST.angle))
    polygonVertex[4] =
      stopPoint.x -
      CONST.edgeLen * Math.cos((Math.PI / 180) * (Plot.angle - CONST.angle))
    polygonVertex[5] =
      stopPoint.y -
      CONST.edgeLen * Math.sin((Math.PI / 180) * (Plot.angle - CONST.angle))
  },

  // 获取另两个底边侧面点
  sideCoord() {
    let midpoint = {}
    midpoint.x = (polygonVertex[4] + polygonVertex[8]) / 2
    midpoint.y = (polygonVertex[5] + polygonVertex[9]) / 2
    polygonVertex[2] = (polygonVertex[4] + midpoint.x) / 2
    polygonVertex[3] = (polygonVertex[5] + midpoint.y) / 2
    polygonVertex[10] = (polygonVertex[8] + midpoint.x) / 2
    polygonVertex[11] = (polygonVertex[9] + midpoint.y) / 2
  },

  // 画箭头
  drawArrow(ctx, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(polygonVertex[0], polygonVertex[1])
    ctx.lineTo(polygonVertex[2], polygonVertex[3])
    ctx.lineTo(polygonVertex[4], polygonVertex[5])
    ctx.lineTo(polygonVertex[6], polygonVertex[7])
    ctx.lineTo(polygonVertex[8], polygonVertex[9])
    ctx.lineTo(polygonVertex[10], polygonVertex[11])
    ctx.closePath()
    ctx.fill()
  }
}


const todo = (ctx, originX, originY, x, y, color) => {
  beginPoint.x = originX
  beginPoint.y = originY
  stopPoint.x = x
  stopPoint.y = y
  Plot.arrowCoord(beginPoint, stopPoint)
  Plot.sideCoord()
  Plot.drawArrow(ctx, color)
}

export default todo
