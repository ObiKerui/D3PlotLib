/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'

import CodeBlock from '../CodeBlock'
// import HeatmapPlot from '../HeatmapPlot/HeatmapPlot'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

async function createHeartbeatPlot(ref: HTMLDivElement) {
  const csvdata = await d3.csv('assets/ecg_data.csv')

  // console.log('heartbeat data (length): ', csvdata.length, csvdata)

  const xs = csvdata.map((elem: any) => +elem.time)

  const ys1 = csvdata.map((elem: any) => +elem.ecg1)

  const ys2 = csvdata.map((elem: any) => +elem.ecg2)

  const makeXScale = (_xs: number[]) => d3.scaleLinear().domain(d3.extent(_xs))

  const makeYScale = (ys: []) => {
    const merged = [].concat([], ...ys)
    const baseExtent = d3.extent(merged)
    baseExtent[0] -= 2
    baseExtent[1] += 2

    return d3.scaleLinear().domain(baseExtent)
  }

  const scaler = d3PlotLib.Scaler().xScale(makeXScale).yScale(makeYScale)

  const plot1 = d3PlotLib.Plot().tag('plot1').xs(xs).ys(ys1).labels('A').curve(d3.curveMonotoneX)

  const plot2 = d3PlotLib
    .Plot()
    .tag('plot2')
    .xs(xs)
    .ys(ys2)
    .labels('B')
    .alpha(0.3)
    .curve(d3.curveMonotoneX)

  const container = (d3PlotLib.Container() as any)
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(plot1)
    .plot(plot2)

  d3.select(ref).call(container)

  return container
}

async function updatePlot(plotObj: any) {
  // let ticks = 0
  // let heartbeatPlot = await chartHeartbeatPlotRef
  // let button = this.$refs.timerref

  // if(timer === null || timer === undefined) {
  //   timer = setInterval(() => {
  const ys1 = plotObj.plot('plot1').ys()
  const ys2 = plotObj.plot('plot2').ys()
  const [ys1Elem] = ys1
  const [ys2Elem] = ys2

  let first = ys1Elem.shift()
  ys1Elem.push(first)

  first = ys2Elem.shift()
  ys2Elem.push(first)

  plotObj.plot('plot1').ys([ys1])
  plotObj.plot('plot2').ys([ys2])

  // plotObj(d3.select(ref))
  // d3.select(this.$refs.heartbeatref).call(heartbeatPlot)
  // ticks++
  // button.innerText = "stop"
  //   }, 30)
  // } else {
  //   clearInterval(timer)
  //   timer = null
  //   button.innerText = "start"
  // }
}

export default function () {
  const ref = useRef(null)
  const [buttonText, setButtonText] = useState('start')
  const plotObj = useRef(null)
  const timer = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    const obj = await createHeartbeatPlot(currRef)
    plotObj.current = obj
  })

  const handleClick = () => {
    if (timer.current === null) {
      setButtonText('stop')
      timer.current = setInterval(() => {
        updatePlot(plotObj.current)
        plotObj.current(d3.select(ref.current))
      }, 30)
    } else {
      clearInterval(timer.current)
      timer.current = null
      setButtonText('start')
    }
  }

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="animated-ecg-plot">Heartbeat</h3>
        <div className="plot--controls">
          <button type="button" className="btn btn-primary" onClick={() => handleClick()}>
            {buttonText}
          </button>
        </div>

        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Heartbeat is for rendering such n such. Good for which types of visual, bad for these
            others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>
          <CodeBlock content={content} />
        </code>
      </div>
    </div>
  )
}
