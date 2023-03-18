/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'

import CodeBlock from '../CodeBlock'
import importGeojson from '../../utils/mapDataUtils'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

// declare const topojson: any

async function createElectionMap(ref: HTMLDivElement) {
  const geojson = await importGeojson('assets/NE.geojson')
  // const geojson = await d3.json('assets/NE.geojson')
  geojson.features = [geojson.features[10]]

  const newCoordsArr = geojson.features[0].geometry.coordinates
  let arrayOf162Points = newCoordsArr[0]
  arrayOf162Points = [
    arrayOf162Points[0],
    arrayOf162Points[50],
    arrayOf162Points[100],
    arrayOf162Points[161],
  ]

  geojson.features[0].geometry.coordinates = [arrayOf162Points]
  // geojson.features[0].geometry.coordinates = newCoordsArr
  // const propData: any = await d3.json('assets/properties.geojson')

  // const pois = (d3PlotLib.MapMarkers() as any).data(propData.data)
  console.log('geojson now: ', geojson)

  const wards = (d3PlotLib.GoogleMapLayer() as any).geojson(geojson).onStyle((args: any) => {
    const { zoomLevel } = args
    const strokeWidth = zoomLevel > 8 ? '1px' : '0.1px'
    const fillOpacity = zoomLevel > 8 ? '.3' : '.4'
    return `
      stroke: blue;
      stroke-width: ${strokeWidth};
      fill-opacity: ${fillOpacity};
      fill: gray;
    `
  })

  // const apiKey = 'AIzaSyCCkEuj6grqxLJKehRrkR2nfT5ZmEMvZCA'

  const container = d3PlotLib
    .GoogleMapContainer()
    .viewType('mapbox/satellite-v9')
    // .apiKey(apiKey)
    .position([54.9783, -1.6178])
    .zoom(8)
    .plot(wards)
  // .plot(pois)

  d3.select(ref).call(container)
  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createElectionMap(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="leaflet-map">Election Map</h3>
        <div className="plot plot--area leaflet-map" ref={ref} />
        <div className="plot plot--description">
          <p>
            Election map is for rendering such n such. Good for which types of visual, bad for these
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
