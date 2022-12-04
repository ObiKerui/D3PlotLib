declare const d3: any;

export default {
    linspace(from: number, stop: number, len: number) {
      let multiplier = (stop - from) / len
      let arr = d3.range(from, stop, multiplier)
      return arr
    },
  
    mean(arr: any) {
      return d3.mean(arr)
    },
  
    std(arr: any) {
      return d3.deviation(arr)
    },
  
    random_normal(mu: any, sigma: any, len: any) {
      let ftn = d3.randomNormal(mu, sigma)
      let arr = Array.from({ length: len }, () => ftn())
      return arr
    },
  
    histogram(arr: any, bins: number) {
      let extents = d3.extent(arr)
      let range = extents[1] - extents[0]
      let binSize = range / bins
      let binFtn = d3.bin().thresholds(bins)
      let results = binFtn(arr)
    },
    
        pdf(xs: number[], mean: number, std: number): number[] {
          let fnorm = (x: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-x * x) / 2)
          let result = xs.map((elem: number, ith: number) => {
            return fnorm(elem)
          })
          // var y = new Array()
          // for (var i = 0 ; i < x.length ; i++) {
          //     y[i] = fnorm(x[i])
          // }
          return result
        }
    
}


  