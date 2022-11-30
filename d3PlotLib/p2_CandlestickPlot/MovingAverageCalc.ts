// p2_CandlestickPlot / MovingAverage.ts
'use strict'
// import { plotAttrs } from '../ChartAttribs'

declare const d3: any
declare const moment: any
declare const L: any
declare const $: any
declare const _: any

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
//   let obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let _container: any = null
  let _window_size = 1

  function toExport(data: any[], ftn: any) {
    let ys = (ftn ? data.map(ftn) : data)

    let window = (_window_size % 2 === 0 ? _window_size : _window_size + 1)
    let half_window = window / 2
    let result = moving_average(half_window, half_window, ys)
    // console.log('data / ma: ', ys, result)

    return result

  }

  function sum(numbers: number[]) {
    return _.reduce(numbers, (a: number, b: number) => a + b, 0);
  }  

  function average(numbers: number[]) {
    return sum(numbers) / (numbers.length || 1);
  }  

  function make_window(before: number, after: number) {
    return function (_number: number, index: number, array: number[]) {
      const start = Math.max(0, index - before);
      const end   = Math.min(array.length, index + after + 1);
      return _.slice(array, start, end);
    }
  }  

  function moving_average(before: number, after: number, numbers: number[]) {
    return _.chain(numbers)
            .map(make_window(before, after))
            .map(average)
            .value()
  }  

  let callable_obj: any = toExport

  toExport.window_size = function (_x: any) {
    if(arguments.length) {
        _window_size = _x
        return callable_obj
    } else {
        return _window_size
    }
  }

  return toExport
}
