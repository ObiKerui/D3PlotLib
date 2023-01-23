/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'
import useCreatePlot from '../UseCreatePlot'

async function createBarPlot(ref: HTMLDivElement, data: any[]) {
  const [xs, bars, yLineData] = data

  const scaler = d3PlotLib
    .Scaler()
    .xScale((xss: any) => d3.scaleBand().domain(xss).padding(0.1))
    .yScale((ys: any) => {
      const merged = [].concat([], ...ys)
      const extent = d3.extent(merged)
      return d3.scaleLinear().domain([0, +extent[1] + 1])
    })

  const hist = d3PlotLib //
    .BarPlot()
    .xs(xs)
    .alpha([0.8])
    .ys(bars)
    .labels(['Profit'])

  const yLines = d3PlotLib.AyLine().ys(yLineData)

  const legend = d3PlotLib.Legend()

  const container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(hist)
    .plot(yLines)
    .legend(legend)

  d3.select(ref).call(container)

  return container
}

function BarPlot({ data }: any): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    let dataForBar = data
    if (!data || !Array.isArray(data)) {
      dataForBar = []
    }
    await createBarPlot(currRef, dataForBar)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="bar-plot">Bar Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Bar plot is for rendering such n such. Good for which types of visual, bad for these
            others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>how to paste in the code here?</code>
      </div>
    </div>
  )
}

function BarPlotContainer() {
  const [data, setData] = useState([])

  const xs = [1, 2, 3, 4, 5, 6, 7, 8]
  const bars = [4, 5, 6, 6, 6, 7, 8, 9]
  const yLineData = [2, 5]

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const receivedData = [xs, bars, yLineData]
      setData(receivedData)
    }

    // eslint-disable-next-line no-console
    fetchData().catch(console.error)
  }, [])

  if (data.length > 0) {
    return <BarPlot data={data} />
  }
  return <div>loading...</div>
}

export { createBarPlot, BarPlot, BarPlotContainer }
