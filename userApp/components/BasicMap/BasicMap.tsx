/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'

import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

declare const topojson: any

async function createBasicMap(ref: any) {
  const json: any = await d3.json('assets/mexico.json')
  const geojson = topojson.feature(json, json.objects.MEX_adm1)

  const citiesCSV = await d3.csv('assets/mexico_cities.csv')

  const projector = d3PlotLib.DevMapProjection().projection(d3.geoMercator())

  const regions = (d3PlotLib.DevMapLayer() as any).geojson(geojson)

  const cities = (d3PlotLib.DevMapMarkers() as any).data(citiesCSV)

  const cityLabels = (d3PlotLib.DevLabels() as any).data(citiesCSV)

  // .draw((elem: any, ith: number) => {
  //     return d3.symbol().type(d3.symbolSquare).size(45)()
  // })

  const container = (d3PlotLib.DevMapContainer() as any)
    .projector(projector)
    .plot(regions)
    .plot(cities)
    .plot(cityLabels)

  d3.select(ref).call(container)
  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createBasicMap(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="basic-map">Basic Map</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Basic map is for rendering such n such. Good for which types of visual, bad for these
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
