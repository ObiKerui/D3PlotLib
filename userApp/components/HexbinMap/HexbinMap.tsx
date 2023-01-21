/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'
import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

declare const topojson: any

async function createHexbinMap(ref: any) {
  const json: any = await d3.json('assets/USA.json')
  const geojson = topojson.feature(json, json.objects.us)

  let datapoints: any[] = await d3.json('assets/markets_overall.json')
  datapoints = datapoints.map((el: any) => {
    const copy = { ...el }
    copy.long = el.lng
    return copy
  })

  // extract mainland USA
  const geojsonCopy = JSON.parse(JSON.stringify(geojson))
  const mainlandCoords = geojson.features[0].geometry.coordinates[7][0]
  geojsonCopy.features[0].geometry.coordinates = [[mainlandCoords]]

  const projector = d3PlotLib.DevMapProjection().projection(d3.geoAlbers())

  const hexes = (d3PlotLib.DevHexBinLayer() as any).geojson(geojsonCopy).datapoints(datapoints)

  const regions = (d3PlotLib.DevMapLayer() as any).geojson(geojsonCopy)

  const container = (d3PlotLib.DevMapContainer() as any)
    .margin({ left: 10, right: 10, top: 10, bottom: 10 })
    .projector(projector)
    .plot(regions)
    .plot(hexes)

  d3.select(ref).call(container)
  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createHexbinMap(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="hexbin-map">Hexbin Map</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Hexbin map is for rendering such n such. Good for which types of visual, bad for these
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
