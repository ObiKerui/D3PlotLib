/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import useCreatePlot from '../UseCreatePlot'
import useResize from '../UseResize'
import NumpyClone from '../NumpyClone'
import * as d3PlotLib from '../../../d3PlotLib/main'

declare const moment: any

function getDates(startDate: any, stopDate: any) {
  const dateArray = []
  let currentDate = moment(startDate)
  const stopDateM = moment(stopDate)
  while (currentDate <= stopDateM) {
    const momentDate = moment(currentDate).format('YYYY-MM-DD')
    const jsDate = new Date(momentDate)
    dateArray.push(jsDate)
    currentDate = moment(currentDate).add(1, 'days')
  }
  return dateArray
}

const xs = getDates('2020-01-01', '2020-12-31')
const ys = NumpyClone.noise(0, 0.5, xs.length)
const ys2 = NumpyClone.noise(0.5, 0.6, xs.length)

const vLine = d3PlotLib
  .AxLine()
  .xs([xs[15], xs[20], xs[23], xs[30]])
  .labels('Cut Off')
  .alpha(0.5)
  .styles('--')

async function createPrimaryLinePlot(ref: HTMLDivElement) {
  const scaler = d3PlotLib
    .Scaler()
    .xScale((_xs: number[]) => d3.scaleTime().domain(d3.extent(_xs)))
    .yScale(() => d3.scaleLinear().domain([d3.extent(ys)[0], 1]))

  const plot1 = d3PlotLib.Plot().xs(xs).ys(ys).tag('plot1').labels('Norm')

  const plot2 = d3PlotLib.Plot().xs(xs).ys(ys2).tag('plot2').labels('Skew')

  const container = d3PlotLib
    .Container()
    .margin({ left: 50, right: 20, top: 10, bottom: 40 })
    .height(300)
    .xAxisText({ rotation: 65 })
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(plot1)
    .plot(plot2)
    .plot(vLine)
    .legend(d3PlotLib.Legend())

  d3.select(ref).call(container)

  return container
}

async function createSecondaryLinePlot(ref: HTMLDivElement, primaryPlot: any, primRef: any) {
  const scaler = d3PlotLib
    .Scaler()
    .xScale((_xs: any[]) => d3.scaleTime().domain(d3.extent(_xs)))
    .yScale((_ys: any) => {
      // eslint-disable-next-line prefer-spread
      const merged = [].concat.apply([], _ys)
      const extent = d3.extent(merged)
      const start = extent[0]
      const end = 1
      return d3.scaleLinear().domain([+start, +end])
    })

  const plot1 = d3PlotLib.Plot().xs(xs).ys(ys).tag('plot1').labels('Norm')

  const plot2 = d3PlotLib.Plot().xs(xs).ys(ys2).tag('plot2').labels('Skew')

  const brush = d3PlotLib.DevBrush().onChange((newScale: any) => {
    const localScaler = primaryPlot.scale()
    localScaler.xScale(() => d3.scaleTime().domain(newScale.domain()))
    primaryPlot(d3.select(primRef))
  })

  // let plot2 = d3PlotLib.Plot().tag('plot2').labels('SkewNorm')

  const container = d3PlotLib
    .Container()
    .margin({ left: 50, right: 20, top: 10, bottom: 60 })
    .height(200)
    .xAxisLabel('X Axis')
    .xAxisText({ rotation: 65 })
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(plot1)
    .plot(plot2)
    .plot(vLine)
    .legend(brush)

  d3.select(ref).call(container)

  return container
}

export default function () {
  const pRef = useRef(null)
  let primaryPlotObj: any = null

  const sRef = useRef(null)
  let secondaryPlotObj: any = null

  useCreatePlot(async () => {
    const pCurrRef = pRef.current
    const pObj = await createPrimaryLinePlot(pCurrRef)
    primaryPlotObj = pObj

    const sCurrRef = sRef.current
    const sObj = await createSecondaryLinePlot(sCurrRef, primaryPlotObj, pCurrRef)
    secondaryPlotObj = sObj
  })

  useResize(() => {
    if (primaryPlotObj) {
      const pCurrRef = pRef.current
      primaryPlotObj(d3.select(pCurrRef))
    }

    if (secondaryPlotObj) {
      const sCurrRef = sRef.current
      secondaryPlotObj(d3.select(sCurrRef))
    }
  })

  function updatePlot() {
    if (primaryPlotObj) {
      const pCurrRef = pRef.current
      primaryPlotObj.plot('plot1').xs([1, 2, 3]).ys([2, 4, 5])

      primaryPlotObj(d3.select(pCurrRef))
    }

    if (secondaryPlotObj) {
      const sCurrRef = sRef.current
      secondaryPlotObj.plot('plot1').xs([1, 2, 3]).ys([2, 4, 5])

      secondaryPlotObj(d3.select(sCurrRef))
    }
  }

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="dynamic-line-plot">Dynamic Line Plot</h3>
        <div className="plot--controls">
          <button type="button" className="btn btn-primary" onClick={() => updatePlot()}>
            Update Me!
          </button>
        </div>
        <div className="plot plot--area" style={{ paddingBottom: 0 }} ref={pRef} />
        <div className="plot plot--area" style={{ paddingTop: 0 }} ref={sRef} />
        <div className="plot plot--description">
          <p>
            Dynamic Line plot is for rendering such n such. Good for which types of visual, bad for
            these others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>how to paste in the code here?</code>
      </div>
    </div>
  )
}
