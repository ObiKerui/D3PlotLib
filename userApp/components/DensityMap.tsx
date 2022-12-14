import React, { useRef, useLayoutEffect, useEffect } from 'react'
import useCreatePlot from './UseCreatePlot'
declare const d3: any
declare const d3PlotLib: any
declare const topojson: any

async function create_density_map(ref: any) {

    // create the states geojson
    const states_geojson = await d3.json('assets/us-states.geojson')
    let featuresArr = states_geojson.features
    let filteredFeaturesArr = featuresArr.filter((elem : any) => {
        let name = elem.properties.name
        return (name !== "Alaska" && name !== "Hawaii" && name !== "Puerto Rico")
    })

    let states_geojson_copy = {...states_geojson}
    states_geojson_copy.features = filteredFeaturesArr

    // create the counties geojson    
    const counties_geojson = await d3.json('assets/us-counties.geojson')
    let countiesFeatureArr = counties_geojson.features
    let filteredCounties = countiesFeatureArr.filter((elem: any) => {
        let stateId = elem.properties.STATEFP
        return (stateId !== "02" && stateId !== "15" && stateId !== "72")
    })

    // add the unemployment rate data
    const unemployment_csv = await d3.csv('assets/unemployment-x.csv')

    const minMaxUnemploymentRate = d3.extent(unemployment_csv, (elem: any) => {
        return +(elem.rate)
    })

    let colorScale = d3.scaleSequential((t: any) => {
        // return d3.interpolateViridis(t)
        return d3.interpolateReds(t)
    })
    .domain([minMaxUnemploymentRate[0], minMaxUnemploymentRate[1]])	
  
    let counties_geojson_copy = {...counties_geojson}
    counties_geojson_copy.features = filteredCounties

    // match up the unemployment rate with the county
    for(let i = 0; i < counties_geojson_copy.features.length; i++) {
        let county = counties_geojson_copy.features[i]
        let countyGeoID = county.properties.GEOID 
        let j = 0
        for(; j < unemployment_csv.length; j++) {
            const unemploymentInCounty = unemployment_csv[j]
            const id = unemploymentInCounty.id
            const rate = unemploymentInCounty.rate

            if(id === countyGeoID) {
                county.properties['rate'] = +rate
                break
            }
        }
    }

    const projector = d3PlotLib.DevMapProjection()
    .projection(d3.geoAlbers())

    const counties = d3PlotLib.DevMapLayer()
    .geojson(states_geojson_copy)
    .onStyle((args: any) => {
        return {
            'stroke': 'Brown',
            'stroke-width': '.4',
            'fill-opacity' : '0'
        }
    })

    const unemployment = d3PlotLib.DevMapLayer()
    .geojson(counties_geojson_copy)
    .onStyle((args: any) => {
        const { elem } = args
        const rate = elem.properties.rate
        const colour = colorScale(rate);
        return  {
            'stroke': 'Orange',
            'stroke-width': '.1',
            'fill-opacity': 1,
            'fill' : colour    
        }
    })

    const zoomer = d3PlotLib.DevZoom()

    const container = d3PlotLib.DevMapContainer()
    .margin({ left: 10, right: 10, top: 10, bottom: 10 })
    .zoomer(zoomer)
    .projector(projector)
    .plot(unemployment)
    .plot(counties)

    d3.select(ref).call(container)
    return container 
}

export default function () {
    let ref = useRef(null)
    let plotObj: any = null
  
    useCreatePlot(async () => {
      const currRef = ref.current
      let obj = await create_density_map(currRef)
      plotObj = obj
    })
  
    return (
      <div className='plot'>
        <div className="plot plot--container">
          <h3 id="density-map">Density Map</h3>
          <div className="plot plot--area" ref={ref}></div>
          <div className="plot plot--description">
            <p>Density map is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
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