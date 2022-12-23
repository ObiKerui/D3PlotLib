export default `
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
`