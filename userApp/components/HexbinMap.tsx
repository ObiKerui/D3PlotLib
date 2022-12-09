import React, { useRef, useLayoutEffect, useEffect } from 'react'
import useCreatePlot from './UseCreatePlot'
declare const d3: any
declare const d3PlotLib: any
declare const topojson: any

async function create_hexbin_map(ref : any) {
    const json = await d3.json('assets/USA.json')
    const geojson = topojson.feature(json, json.objects.us)

    let datapoints = await d3.json('assets/markets_overall.json')
    datapoints = datapoints.map((el: any) => {
        let copy = {...el}
        copy['long'] = el['lng']
        return copy 
    }) 

    // extract mainland USA
    let geojsonCopy = JSON.parse(JSON.stringify(geojson))
    const mainlandCoords = geojson.features[0].geometry.coordinates[7][0]
    geojsonCopy.features[0].geometry.coordinates = [[mainlandCoords]]
    
    const projector = d3PlotLib.DevMapProjection()
    .projection(d3.geoAlbers())

    const hexes = d3PlotLib.DevHexBinLayer()
    .geojson(geojsonCopy)
    .datapoints(datapoints)

    const regions = d3PlotLib.DevMapLayer()
    .geojson(geojsonCopy)

    const container = d3PlotLib.DevMapContainer()
    .margin({ left: 10, right: 10, top: 10, bottom: 10 })
    .projector(projector)
    .plot(regions)
    .plot(hexes)

    d3.select(ref).call(container)
    return container 
}

export default function () {
  let ref = useRef(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await create_hexbin_map(currRef)
    plotObj = obj
  })

  return (
    <div className='plot'>
      <div className="plot plot--container">
        <h3>Hexbin Map</h3>
        <div className="plot plot--area" ref={ref}></div>
        <div className="plot plot--description">
          <p>Hexbin map is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>
          how to paste in the code here?          
        </code>
      </div>
    </div>
  )
}