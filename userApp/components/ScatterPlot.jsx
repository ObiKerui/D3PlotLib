import React, { useRef, useLayoutEffect } from 'react'
const d3 = window.d3 
const d3PlotLib = window.d3PlotLib

let np = {
    linspace(from, stop, len) {
      let multiplier = (stop - from) / len
      let arr = d3.range(from, stop, multiplier)
      return arr
    },
  
    mean(arr) {
      return d3.mean(arr)
    },
  
    std(arr) {
      return d3.deviation(arr)
    },
  
    random_normal(mu, sigma, len) {
      let ftn = d3.randomNormal(mu, sigma)
      let arr = Array.from({ length: len }, () => ftn())
      return arr
    },
  
    histogram(arr, bins) {
      let extents = d3.extent(arr)
      let range = extents[1] - extents[0]
      let binSize = range / bins
  
      let binFtn = d3.bin().thresholds(bins)
  
      let results = binFtn(arr)
  
      // console.log('extent / range / binsize: ', extents, range, binSize)
      // console.log('results: ', results)
      // return counts and bins
    },
  }
  
//   let norm = {
//     pdf(xs: number[], mean: number, std: number): number[] {
//       let fnorm = (x: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-x * x) / 2)
//       let result = xs.map((elem: number, ith: number) => {
//         return fnorm(elem)
//       })
//       // var y = new Array()
//       // for (var i = 0 ; i < x.length ; i++) {
//       //     y[i] = fnorm(x[i])
//       // }
//       return result
//     },
//   }
  
  async function createScatterPlot(ref) {

    let csvresult = await d3.csv('assets/iris.csv')
  
    let xs = np.linspace(0, 200, 200)
  
    let keys = Object.keys(csvresult[0])
    let obj = keys.reduce((accumulator, value) => {
      return {...accumulator, [value]: []}
    }, {})
  
    csvresult.forEach((elem) => {
      keys.forEach((e) => { 
          obj[e].push(+(elem[e]))
      })
      return elem
    })
  
    let ys = Object.values(obj)
  
    let scaler = d3PlotLib
      .Scaler()
      .xScale((xs) => {
        return d3.scaleLinear()
        .domain(d3.extent(xs))
      })
      .yScale((ys) => {
          let merged = [].concat.apply([], ys)
        return d3.scaleLinear()
        .domain(d3.extent(merged))
      })
  
      console.log('xs / ys ', xs, ys, keys)

    let scatterPlot = d3PlotLib.ScatterPlot()
    .xs(xs)
    .ys(ys)
    .colours(['red', 'green', 'blue', 'black'])
    .labels(keys)
  
    let container = d3PlotLib.Container()
    .scale(scaler)
    .plot(scatterPlot)
    .legend(d3PlotLib.Legend())
  
      console.log('select the container...')

    d3.select(ref).call(container)

    console.log('return the container...')
    
    return container
}

export default function() {
    let ref = useRef(null)
    let scatterObj = null

    useLayoutEffect(() => {
        async function createScatter() {
            const currRef = ref.current 
            return await createScatterPlot(currRef)
        }

        if(scatterObj === null) {
            scatterObj = createScatter()
        }
        return () => {
        //Do some cleanup here
        };
    }, []);

    return (
        <>
            <h3>Scatter Plot</h3>
            <div ref={ref}></div>
        </>
    )
}