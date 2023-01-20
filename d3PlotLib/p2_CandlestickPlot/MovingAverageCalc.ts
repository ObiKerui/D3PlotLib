/* eslint-disable @typescript-eslint/no-explicit-any */
declare const _: any

export default function () {
  let windowSize = 1

  function sum(numbers: number[]) {
    return _.reduce(numbers, (a: number, b: number) => a + b, 0)
  }

  function average(numbers: number[]) {
    return sum(numbers) / (numbers.length || 1)
  }

  function makeWindow(before: number, after: number) {
    return function (_number: number, index: number, array: number[]) {
      const start = Math.max(0, index - before)
      const end = Math.min(array.length, index + after + 1)
      return _.slice(array, start, end)
    }
  }

  function movingAverage(before: number, after: number, numbers: number[]) {
    return _.chain(numbers).map(makeWindow(before, after)).map(average).value()
  }
  function toExport(data: any[], ftn: any) {
    const ys = ftn ? data.map(ftn) : data

    const window = windowSize % 2 === 0 ? windowSize : windowSize + 1
    const halfWindow = window / 2
    const result = movingAverage(halfWindow, halfWindow, ys)
    // console.log('data / ma: ', ys, result)

    return result
  }

  const callableObj: any = toExport

  toExport.window_size = function (_x: any) {
    if (arguments.length) {
      windowSize = _x
      return callableObj
    }
    return windowSize
  }

  return toExport
}
