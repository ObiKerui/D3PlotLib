/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'

import useCreatePlot from '../UseCreatePlot'
import CodeBlock from '../CodeBlock'
import content from './create'

import '../plot.css'

const np = {
  linspace(from: number, stop: number, len: number) {
    const multiplier = (stop - from) / len
    const arr = d3.range(from, stop, multiplier)
    return arr
  },

  mean(arr: ArrayLike<d3.Numeric>) {
    return d3.mean(arr)
  },

  std(arr: ArrayLike<d3.Numeric>) {
    return d3.deviation(arr)
  },

  random_normal(mu: number, sigma: number, len: number) {
    const ftn = d3.randomNormal(mu, sigma)
    const arr = Array.from({ length: len }, () => ftn())
    return arr
  },
}

async function createScatterPlot(ref: HTMLDivElement, data: unknown[]) {
  const [xs, ys, keys] = data

  const scaler = d3PlotLib
    .Scaler()
    .xScale((_xs: number[]) => d3.scaleLinear().domain(d3.extent(_xs)))
    .yScale((_ys: number[]) => {
      const merged: number[] = [].concat([], ..._ys)
      return d3.scaleLinear().domain(d3.extent(merged))
    })

  const scatterPlot = d3PlotLib
    .ScatterPlot()
    .ys(ys as unknown[])
    .xs(xs)
    .colours(['red', 'green', 'blue', 'black'])
    .labels(keys)

  const container = (d3PlotLib.Container() as any)
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(scatterPlot)
    .legend(d3PlotLib.Legend())

  d3.select(ref).call(container)
}

interface Props {
  data?: unknown[]
}

function ScatterPlot({ data }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    let dataForBar = data
    if (!data || !Array.isArray(data) || data.length !== 3) {
      dataForBar = [[], [], []]
    }
    await createScatterPlot(currRef, dataForBar)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="bar-plot">Scatter Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Bar plot is for rendering such n such. Good for which types of visual, bad for these
            others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <CodeBlock content={content} />
      </div>
    </div>
  )
}

ScatterPlot.defaultProps = {
  data: [],
}

function ScatterPlotContainer(): JSX.Element {
  const [data, setData] = useState([])

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const csvresult = await d3.csv('assets/iris.csv')
      const xs = np.linspace(0, 160, 160)
      const keys = Object.keys(csvresult[0])
      const obj: any = keys.reduce((accumulator, value) => ({ ...accumulator, [value]: [] }), {})

      csvresult.forEach((elem: { [x: string]: any }) => {
        keys.forEach((e) => {
          obj[e].push(+elem[e])
        })
        return elem
      })

      const ys = Object.values(obj)

      const receivedData = [xs, ys, keys]
      setData(receivedData)
    }

    // eslint-disable-next-line no-console
    fetchData().catch(console.error)
  }, [])

  if (data.length > 0) {
    return <ScatterPlot data={data} />
  }
  return <div>loading...</div>
}

export { createScatterPlot, ScatterPlot, ScatterPlotContainer }
