import React, { useRef, useLayoutEffect, useEffect } from 'react'
import useCreatePlot from './UseCreatePlot'
declare const d3: any
declare const d3PlotLib: any
declare const topojson: any

async function create_basic_map(ref : any) {
    const json = await d3.json('assets/mexico.json')
    const geojson = topojson.feature(json, json.objects.MEX_adm1)
    
    const citiesCSV = await d3.csv('assets/mexico_cities.csv')

    const projector = d3PlotLib.DevMapProjection()
    .projection(d3.geoMercator())

    const regions = d3PlotLib.DevMapLayer()
    .geojson(geojson)

    const cities = d3PlotLib.DevMapMarkers()
    .data(citiesCSV)

    const cityLabels = d3PlotLib.DevLabels()
    .data(citiesCSV)

    // .draw((elem: any, ith: number) => {
    //     return d3.symbol().type(d3.symbolSquare).size(45)()
    // })
    
    const container = d3PlotLib.DevMapContainer()
    .projector(projector)
    .plot(regions)
    .plot(cities)
    .plot(cityLabels)

    d3.select(ref).call(container)
    return container 
}

export default function () {
  let ref = useRef(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await create_basic_map(currRef)
    plotObj = obj
  })

  return (
    <div className='plot'>
      <div className="plot plot--container">
        <h3 id="basic-map">Basic Map</h3>
        <div className="plot plot--area" ref={ref}></div>
        <div className="plot plot--description">
          <p>Basic map is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
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