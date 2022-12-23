export default `
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

const container = d3PlotLib.DevMapContainer()
.projector(projector)
.plot(regions)
.plot(cities)
.plot(cityLabels)

d3.select(ref).call(container)
`