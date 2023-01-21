/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'
import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

// declare const topojson: any

async function createDensityMap(ref: any) {
  // create the states geojson
  const statesGeojson: any = await d3.json('assets/us-states.geojson')
  const featuresArr = statesGeojson.features
  const filteredFeaturesArr = featuresArr.filter((elem: any) => {
    const { name } = elem.properties
    return name !== 'Alaska' && name !== 'Hawaii' && name !== 'Puerto Rico'
  })

  const statesGeojsonCopy = { ...statesGeojson }
  statesGeojsonCopy.features = filteredFeaturesArr

  // create the counties geojson
  const countiesGeojson: any = await d3.json('assets/us-counties.geojson')
  const countiesFeatureArr = countiesGeojson.features
  const filteredCounties = countiesFeatureArr.filter((elem: any) => {
    const stateId = elem.properties.STATEFP
    return stateId !== '02' && stateId !== '15' && stateId !== '72'
  })

  // add the unemployment rate data
  const unemploymentCsv = await d3.csv('assets/unemployment-x.csv')

  const minMaxUnemploymentRate = d3.extent(unemploymentCsv, (elem: any) => +elem.rate)

  const colorScale = d3
    .scaleSequential((t: any) =>
      // return d3.interpolateViridis(t)
      d3.interpolateReds(t)
    )
    .domain([minMaxUnemploymentRate[0], minMaxUnemploymentRate[1]])

  const countiesGeojsonCopy = { ...countiesGeojson }
  countiesGeojsonCopy.features = filteredCounties

  // match up the unemployment rate with the county
  for (let i = 0; i < countiesGeojsonCopy.features.length; i += 1) {
    const county = countiesGeojsonCopy.features[i]
    const countyGeoID = county.properties.GEOID
    let j = 0
    for (; j < unemploymentCsv.length; j += 1) {
      const unemploymentInCounty = unemploymentCsv[j]
      const { id } = unemploymentInCounty
      const { rate } = unemploymentInCounty

      if (id === countyGeoID) {
        county.properties.rate = +rate
        break
      }
    }
  }

  const projector = d3PlotLib.DevMapProjection().projection(d3.geoAlbers())

  const counties = (d3PlotLib.DevMapLayer() as any)
    .geojson(statesGeojsonCopy)
    .onStyle(() => `stroke: Brown; stroke-width: .4; fill-opacity: 0;`)

  const unemployment = (d3PlotLib.DevMapLayer() as any)
    .geojson(countiesGeojsonCopy)
    .onStyle((args: any) => {
      const { elem } = args
      const { rate } = elem.properties
      const colour = colorScale(rate)
      return `
        stroke: Orange;
        stroke-width: .1;
        fill-opacity: 1;
        fill: ${colour};
      `
    })

  const zoomer = d3PlotLib.DevZoom()

  const container = (d3PlotLib.DevMapContainer() as any)
    .margin({ left: 10, right: 10, top: 10, bottom: 10 })
    .zoomer(zoomer)
    .projector(projector)
    .plot(unemployment)
    .plot(counties)

  d3.select(ref).call(container)
  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createDensityMap(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="density-map">Density Map</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Density map is for rendering such n such. Good for which types of visual, bad for these
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
