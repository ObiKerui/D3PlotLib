export default `
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
`