import * as d3 from 'd3'
// import { FeatureCollection } from 'geojson'

interface IPolygon {
  type: 'Polygon'
  coordinates: number[][][]
}

interface IFeature {
  type: 'Feature'
  geometry: IPolygon
}

interface IFeatureCollection {
  type: 'FeatureCollection'
  features: IFeature[]
}

async function importGeojson(path: string) {
  const geoJson: IFeatureCollection = await d3.json(path)
  return geoJson
}

export default importGeojson
