// p2_devZoom/index.ts
'use strict'

declare const d3: any
declare const moment: any
declare const L: any
declare const $: any

export default function () {
    let obj: any = {}
    let zoomDetails: any = null

    //initialize throttlePause variable outside throttle function
    let throttlePause: boolean;
 
    const throttle = (callback: any, time: number) => {
        if (throttlePause) return;
    
        //set throttlePause to true after the if condition. This allows the function to be run once
        throttlePause = true;
    
        //setTimeout runs the callback within the specified time
        setTimeout(() => {
            callback()
            
            //throttlePause is set to false once the function has been called, allowing the throttle function to loop
            throttlePause = false
        }, time)
    }  

  function toExport(containerAttrs: any, plottables: any) {

    let mapWidth = containerAttrs.mapWidth
    let mapHeight = containerAttrs.mapHeight
    let mapGroup = containerAttrs.svg.select("g.map-group")
    let metaGroup = containerAttrs.svg.select("g.metadata-group")

    // let zoomDetails = metaGroup.select("g.zoom-details")
    // console.log('what are zoom details: ', zoomDetails)

    if(zoomDetails === null) {
        function handleZoom(a: any, b: any, e: any) {
            let transform = d3.event.transform
            throttle(() => {
                // console.log('what is transform: ', transform)
                mapGroup.attr('transform', transform)      
            }, 10)
        }

        let zoom = d3.zoom()
        .on('zoom', handleZoom)
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [mapWidth, mapHeight]])

        console.log('what is map group here: ', mapGroup)
        mapGroup.call(zoom)    

        console.log('zoom params: ', containerAttrs, plottables, mapGroup)
        metaGroup.append("g")
        .classed("zoom-details", true)

        zoomDetails = {}
    }
  }

  let callableObj: any = toExport

  function generateAccessor(attr: any) {
    function accessor(value: any) {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return callableObj
    }
    return accessor
  }

  // generate the chart attributes
  for (let attr in obj) {
    if (!callableObj[attr] && obj.hasOwnProperty(attr)) {
      callableObj[attr] = generateAccessor(attr)
    }
  }

  callableObj.attr = function () {
    return obj
  }

  return callableObj
}
