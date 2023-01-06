import * as d3 from 'd3'
import { bin } from 'd3-array'

export default {
  linspace(from: number, stop: number, len: number) {
    const multiplier = (stop - from) / len
    const arr = d3.range(from, stop, multiplier)
    return arr
  },

  noise(from: number, stop: number, len: number) {
    const multiplier = (stop - from) / len
    const arr = d3.range(from, stop, multiplier)
    const noisy = arr.map((elem: number) => d3.randomUniform(elem - 0.05, elem + 0.05)())
    return noisy
  },

  mean(arr: number[]) {
    return d3.mean(arr)
  },

  std(arr: number[]) {
    return d3.deviation(arr)
  },

  random_normal(mu: number, sigma: number, len: number) {
    const ftn = d3.randomNormal(mu, sigma)
    const arr = Array.from({ length: len }, () => ftn())
    return arr
  },

  histogram(arr: number[], bins: number) {
    const extents = d3.extent(arr)
    const range = extents[1] - extents[0]
    const binSize = range / bins
    const binFtn = bin().thresholds(bins)
    const results = binFtn(arr)
  },

  pdf(xs: number[], mean: number, std: number): number[] {
    const fnorm = (x: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-x * x) / 2)
    const result = xs.map((elem: number, ith: number) => fnorm(elem))
    // var y = new Array()
    // for (var i = 0 ; i < x.length ; i++) {
    //     y[i] = fnorm(x[i])
    // }
    return result
  },
}
