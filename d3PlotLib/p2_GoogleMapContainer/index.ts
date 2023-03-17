/* eslint-disable @typescript-eslint/no-explicit-any */
// MapContainer/index.ts
// import { dispatch } from 'd3-dispatch'
import * as d3 from 'd3'
import loadGoogle from './googleLoader'

import { plotAttrs, containerAttrs } from '../MapAttribs'

const publicAttributes = {
  ...containerAttrs,
  ...plotAttrs,
}

export default function () {
  const obj: any = JSON.parse(JSON.stringify(publicAttributes))
  const plots: any = []

  // Dispatcher object to broadcast the mouse events
  // const dispatcher = dispatch(
  //   'customMouseOver',
  //   'customMouseMove',
  //   'customMouseOut',
  //   'customMouseClick'
  // )

  function buildSVG(container: any, overlay: any) {
    let div = null
    const { map } = obj

    if (!obj.svg) {
      // is this necessary?
      container
        .append('div')
        .classed('custom-map-element', true)
        .style('height', obj.height)
        .style('width', obj.width)

      console.log('what does overlay get panes return: ', overlay.getPanes())

      const overlaySelect = d3.select(overlay.getPanes().overlayLayer)
      obj.svg = overlaySelect.append('svg')
      obj.svg.append('g').classed('map-group-google', true)
      obj.overlay = overlay
    }
  }

  // overlayView.draw = () => {
  //     if (!this.userPositionDiv) {
  //         this.userPositionDiv = document.createElement('div');
  //         this.userPositionDiv.className = 'marker';
  //         this.userPositionDiv.style.cssText = `width: 35px; height: 35px; text-align: center; line-height: 35px; position: absolute; cursor: pointer; border-radius: 50%; color: #fff; background: #000`;
  //         this.userPositionDiv.innerHTML = `<span class="number-id">Hello</span>`;
  //         const panes = overlayView.getPanes();
  //         panes.overlayImage.appendChild(this.userPositionDiv);
  //     }
  //     const point = this.overlayView.getProjection().fromLatLngToDivPixel(this.latLng);
  //     if (point) {
  //         this.userPositionDiv.style.left = (point.x - 10) + 'px';
  //         this.userPositionDiv.style.top = (point.y - 10) + 'px';
  //     }
  // }
  // overlayView.setMap(this.gmap);
  // return overlayView
  // }

  function buildMap(htmlSelection: any): Promise<unknown> {
    const { zoom, position } = obj
    let { map } = obj

    const mapOptions = {
      center: {
        lat: +position[0],
        lng: +position[1],
      },
      zoom,
    }

    // document.getElementById('map')
    const mapDiv: HTMLElement = htmlSelection.node()

    const promise = new Promise((res: any) => {
      if (!obj.map) {
        map = new google.maps.Map(mapDiv, mapOptions)
        const overlay = new google.maps.OverlayView()
        overlay.draw = () => {
          buildSVG(htmlSelection, overlay)
          res(obj.map)
        }
        overlay.setMap(map)
        obj.map = map
        obj.overlay = overlay
      }
    })

    return promise
  }

  async function toExport(htmlSelection: any) {
    if (obj.showMargins) {
      obj.svg.style('background-color', 'rgba(255, 0, 0, .2)')
    }

    obj.chartWidth = obj.width - obj.margin.left - obj.margin.right
    obj.chartHeight = obj.height - obj.margin.top - obj.margin.bottom

    await loadGoogle()
    await buildMap(htmlSelection)

    // obj.map.on('zoomend', () => {
    //   plots.forEach((plot: any) => {
    //     plot(obj)
    //   })
    // })

    plots.forEach((plot: any) => {
      plot(obj)
    })
  }

  const chart: any = toExport

  function generateAccessor<Type>(attr: string) {
    function accessor(value: Type): any {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return chart
    }
    return accessor
  }

  toExport.plot = function (x: any) {
    if (Number.isInteger(x) && plots.length > 0) {
      return plots[x]
    }
    if (typeof x === 'string') {
      const labels = plots.filter((elem: any) => elem.tag() === x)
      if (labels.length > 0) {
        return labels[0]
      }
      return null
    }
    plots.push(x)
    return toExport
  }

  toExport.geojson = generateAccessor<unknown>('geojson')
  toExport.data = generateAccessor<unknown>('data')
  toExport.viewType = generateAccessor<string | null>('viewType')
  toExport.position = generateAccessor<number[] | null>('position')
  toExport.zoom = generateAccessor<number | null>('zoom')
  toExport.apiKey = generateAccessor<string | null>('apiKey')

  return toExport
}
