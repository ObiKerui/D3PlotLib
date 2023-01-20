/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'
import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

async function createDonutPlot(ref: any): Promise<any> {
  const csvresult = await d3.csv('assets/iris.csv')

  let labels = Object.keys(csvresult[0])
  labels = labels.slice(0, -1)
  const obj: any = labels.reduce((accumulator, value) => ({ ...accumulator, [value]: [] }), {})

  csvresult.forEach((elem: any) => {
    labels.forEach((e: any) => {
      obj[e as keyof any].push(+elem[e])
    })
    return elem
  })

  const ys = Object.values(obj)

  // sum the values
  const sums = ys.map((y: any) => d3.sum(y))

  // get total
  const total = sums.reduce((accumulator, value) => accumulator + value, 0)

  const percentages = sums.map((y: any) => y / total)

  // console.log('labels / ys / sums / total / percentages ', labels, ys, sums, total, percentages)

  const donutPlot = d3PlotLib.DonutPlot().ys(percentages).labels(labels)

  const container = d3PlotLib.Container().plot(donutPlot)

  d3.select(ref).call(container)

  return container
}

export default function () {
  const ref = useRef(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    const obj = await createDonutPlot(currRef)
    plotObj = obj
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="donut-plot">Donut Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Donut plot is for rendering such n such. Good for which types of visual, bad for these
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
