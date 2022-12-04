import React, { useRef, useLayoutEffect, useEffect } from 'react'
import useCreatePlot from './UseCreatePlot'
declare const d3: any
declare const d3PlotLib: any

async function createGroupedBarPlot(ref: HTMLElement) {
  
    let csvdata = await d3.csv('assets/data_stacked.csv')

    let labels = csvdata.columns
    let subgroups = ['banana', 'poacee', 'sorgho']

    console.log('csvdata / labels: ', csvdata, labels, csvdata.columns)
  
    let groups = d3.map(csvdata, (d: any) => { 
      return(d.group)
    })
  
    let groupKeys = groups.keys()
  
    let scaler = d3PlotLib.Scaler()
    .xScale((xs: any) => {
      return d3.scaleBand()
      .domain(groups)
      .padding(0.1)
    })
    .yScale((ys: any) => {
      return d3.scaleLinear()
      .domain([0, 40])
    })
  
    let bars = d3PlotLib.GroupedBarPlot()
    .alpha([0.4])
    .ys(csvdata)
    .labels(['text'])
  
    let legend = d3PlotLib.Legend()
  
    let container = d3PlotLib
      .Container()
      .xAxisLabel('X Axis')
      .yAxisLabel('Y Axis')
      .scale(scaler)
      .plot(bars)
      .legend(legend)
  
    d3.select(ref).call(container)
    return container
  }
  

export default function () {
  let ref = useRef(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await createGroupedBarPlot(currRef)
    plotObj = obj
  })

  return (
    <div className='plot'>
      <div className="plot plot--container">
        <h3>Grouped Bar Plot</h3>
        <div className="plot plot--area" ref={ref}></div>
        <div className="plot plot--description">
          <p>Grouped Bar Plot is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
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
