// p2_FillArea/interpolator.ts
'use strict'

export default function (obj: any) {
  // let obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let _container: any = null
  let xs = obj.xs
  let ys = obj.ys
  let where = obj.where

  function getMarkers() {
    
    let startDataIdx = 0
    let startIdx = 0 
    let endIdx = xs.length > 0 ? xs.length - 1 : 0
    let endDataIdx = endIdx

    for(let i = 0; i < xs.length; i++) {
        if(where(xs[i])) {
            startIdx = i
            break
        } else {
          startDataIdx = i
        }
    }

    for(let i = startIdx; i < xs.length; i++) {
        if(where(xs[i]) === false) {
            endDataIdx = i
            break
        } else {
          endIdx = i
        }
    }

    return {
      startDataIdx,
      startIdx,
      endIdx,
      endDataIdx
    }
  }

  function findXValueStart(startDataX: number, startX: number, where: any) {
    let iterations = 4
    let multiplier = .5
    let leftBound = startDataX
    let rightBound = startX
    let newStartX = startX

    for (let i = 0; i < iterations; i++) {

      let distance = (rightBound - leftBound) * multiplier
      newStartX = rightBound - distance
  
      let isWithin = where(newStartX)
      // console.log('lefbound / rightbound / newstartX / isWithin ', leftBound, rightBound, newStartX, isWithin)
      if (isWithin) {
        rightBound = newStartX
      } else {
        leftBound = newStartX
      }
    }

    return newStartX
  }

  function findXValueEnd(xEndData: number, xEnd: number, where: any) {
    let iterations = 4
    let multiplier = .5
    let leftBound = xEnd
    let rightBound = xEndData
    let newEndX = xEnd

    for (let i = 0; i < iterations; i++) {

      let distance = (rightBound - leftBound) * multiplier
      newEndX = rightBound - distance

      let isWithin = where(newEndX)
      // console.log('lefbound / rightbound / newEndX / isWithin ', leftBound, rightBound, newEndX, isWithin)
      if (isWithin) {
        leftBound = newEndX
      } else {
        rightBound = newEndX
      }
    }

    return newEndX
  }

  function interpolate(x0: number, x1: number, x: number, y0: number, y1: number) {
    // what %tage is x of x1 - x0
    let percentage = (x - x0) / (x1 - x0)
    let yDiff = y1 - y0
    let newY = y0 + yDiff * percentage

    // console.log('percentage / x / x1 / x0 / yDiff / y1 / y0 / newY ', percentage, x, x1, x0, yDiff, y1, y0, newY)

    return newY
  }

  function execute() {

    // console.log('xs/ys begin with: ', xs, ys)
    
    let { startDataIdx, startIdx, endIdx, endDataIdx } = getMarkers()
    let newXs: number[] = xs.slice(startIdx, endIdx + 1)
    let newYs: number[] = ys.slice(startIdx, endIdx + 1)

    // console.log('markers: startData / start / end / endData ', startDataIdx, startIdx, endIdx, endDataIdx)
    // console.log('newxs / newys : ', newXs, newYs)

    if(startDataIdx < startIdx) {
      let xStartData = xs[startDataIdx]
      let xStart = xs[startIdx]
      let newStartX = findXValueStart(xStartData, xStart, where)
      newXs.unshift(newStartX)

      let yStartData = ys[startDataIdx]
      let yStart = ys[startIdx]
      let newStartY = interpolate(xStartData, xStart, newStartX, yStartData, yStart)
      newYs.unshift(newStartY)
    }

    if(endIdx < endDataIdx) {
      let xEndData = xs[endDataIdx]
      let xEnd = xs[endIdx]
      let newEndX = findXValueEnd(xEndData, xEnd, where)
      newXs.push(newEndX)

      let yEndData = ys[endDataIdx]
      let yEnd = ys[endIdx]
      let newEndY = interpolate(xEnd, xEndData, newEndX, yEnd, yEndData)
      newYs.push(newEndY)
    }

    // console.log('finally new xs / ys ', newXs, newYs)

    return {
      newXs,
      newYs
    }
  }

  let callable_obj: any = execute
  return callable_obj

}
