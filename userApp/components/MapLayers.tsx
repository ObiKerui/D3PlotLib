import React, { useRef, useLayoutEffect, useEffect } from 'react'
import useCreatePlot from './UseCreatePlot'
declare const d3: any
declare const d3PlotLib: any
declare const topojson: any

async function create_election_map(ref : any) {
    const geojson = await d3.json('assets/NE.geojson')
    const propData = await d3.json('assets/properties.geojson')

    const pois = d3PlotLib.MapMarkers()
    .data(propData.data)
        
    const wards = d3PlotLib.MapLayer()
    .geojson(geojson)
    .onStyle((args: any) => {
        const { elem, zoomLevel } = args
        let strokeWidth = (zoomLevel > 8 ? '1px' : '0.1px')
        let fillOpacity = (zoomLevel > 8 ? '.3' : '.4')
        return  {
            'stroke': 'blue',
            'stroke-width': strokeWidth,
            'fill-opacity': fillOpacity,
            'fill' : 'gray'    
        }
    })
    
    const container = d3PlotLib.MapContainer()
    .viewType('mapbox/satellite-v9')
    .position([54.9783, -1.6178])
    .zoom(8)
    .plot(wards)
    .plot(pois)

    d3.select(ref).call(container)    
    return container

}

export default function () {
  let ref = useRef(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await create_election_map(currRef)
    plotObj = obj
  })

  return (
    <div className='plot'>
      <div className="plot plot--container">
        <h3 id="leaflet-map">Election Map</h3>
        <div className="plot plot--area leaflet-map" ref={ref}></div>
        <div className="plot plot--description">
          <p>Election map is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
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