/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'
import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

async function createBoxPlot(ref: HTMLDivElement, csvresult: any) {
  let ys: any[] = []
  let labels: any[] = []

  if (csvresult.length > 0) {
    labels = Object.keys(csvresult[0])
    labels = labels.slice(0, -1)

    // create an empty array for each label
    const arrays: any = labels.reduce((accumulator, value) => ({ ...accumulator, [value]: [] }), {})

    csvresult.forEach((elem: object) => {
      labels.forEach((e: string) => {
        arrays[e as keyof object].push(+elem[e as keyof typeof elem])
      })
      return elem
    })

    ys = Object.values(arrays)
  }

  const scaler = d3PlotLib
    .Scaler()
    .xScale(() => d3.scaleBand().domain(labels).paddingInner(1).paddingOuter(0.5))
    .yScale(() => d3.scaleLinear().domain([-10, 10]))

  const boxplot = d3PlotLib.BoxPlot().ys(ys).labels(labels)

  const container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(boxplot)

  d3.select(ref).call(container)

  return container
}

function BoxPlot({ data }: any) {
  const ref = useRef<HTMLDivElement | null>(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createBoxPlot(currRef, data)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="box-plot">Box Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Box plot is for rendering such n such. Good for which types of visual, bad for these
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

function BoxPlotContainer() {
  const [data, setData] = useState([])

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const receivedData = await d3.csv('http://localhost:3000/assets/iris.csv')
      setData(receivedData)
    }

    // eslint-disable-next-line no-console
    fetchData().catch(console.error)
  }, [])

  if (data.length > 0) {
    return <BoxPlot data={data} />
  }
  return <div>loading...</div>
}

export { createBoxPlot, BoxPlot, BoxPlotContainer }
