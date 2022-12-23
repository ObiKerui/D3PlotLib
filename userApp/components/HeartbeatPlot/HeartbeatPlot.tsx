import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'
import CodeBlock from '../CodeBlock'
import HeatmapPlot from '../HeatmapPlot/HeatmapPlot'
import useCreatePlot from '../UseCreatePlot'
import content from './create'
declare const d3: any
declare const d3PlotLib: any


async function createHeartbeatPlot(ref: any) {
    let csvdata = await d3.csv('assets/ecg_data.csv')

    // console.log('heartbeat data (length): ', csvdata.length, csvdata)

    let xs = csvdata.map((elem: any) => {
      return +(elem['time'])
    })

    let ys1 = csvdata.map((elem: any) => {
      return +(elem.ecg1)
    })

    let ys2 = csvdata.map((elem: any) => {
      return +(elem.ecg2)
    })
  
    let makeXScale = (xs : []) => {
      return d3.scaleLinear()
      .domain(d3.extent(xs))
    }
  
    let makeYScale = (ys : []) => {
      let merged = [].concat.apply([], ys)
      let baseExtent = d3.extent(merged)
      baseExtent[0] = baseExtent[0] - 2
      baseExtent[1] = baseExtent[1] + 2

      return d3.scaleLinear()
      .domain(baseExtent)    
    }
  
    let scaler = d3PlotLib.Scaler()
    .xScale(makeXScale)
    .yScale(makeYScale)
  
    let plot1 = d3PlotLib.Plot()
    .tag("plot1")
    .xs(xs)
    .ys(ys1)
    .labels('A')
    .curve(d3.curveMonotoneX)

    let plot2 = d3PlotLib.Plot()
    .tag("plot2")
    .xs(xs)
    .ys(ys2)
    .labels('B')
    .alpha(0.3)
    .curve(d3.curveMonotoneX)

    let container = d3PlotLib
      .Container()
      .xAxisLabel('X Axis')
      .yAxisLabel('Y Axis')
      .scale(scaler)
      .plot(plot1)
      .plot(plot2)
  
    d3.select(ref).call(container)
  
    return container

  }

  async function updatePlot(plotObj: any) {
    // let ticks = 0
    // let heartbeatPlot = await chartHeartbeatPlotRef
    // let button = this.$refs.timerref

    // if(timer === null || timer === undefined) {
    //   timer = setInterval(() => {
        let ys1 = plotObj.plot("plot1").ys()
        let ys2 = plotObj.plot("plot2").ys()          
        ys1 = ys1[0]
        ys2 = ys2[0]
        
        let first = ys1.shift()
        ys1.push(first)

        first = ys2.shift()
        ys2.push(first)

        plotObj.plot("plot1").ys([ys1])
        plotObj.plot("plot2").ys([ys2])
        
        // plotObj(d3.select(ref))
        // d3.select(this.$refs.heartbeatref).call(heartbeatPlot)
        // ticks++
        // button.innerText = "stop"
    //   }, 30)
    // } else {
    //   clearInterval(timer)
    //   timer = null
    //   button.innerText = "start"
    // }
  }


  export default function () {
    let ref = useRef(null)
    let [buttonText, setButtonText] = useState('start')
    let plotObj = useRef(null)
    let timer = useRef(null)
  
    useCreatePlot(async () => {
      const currRef = ref.current
      let obj = await createHeartbeatPlot(currRef)
      plotObj.current = obj
    })

    let handleClick = () => {
        if(timer.current === null) {
            setButtonText('stop')
            timer.current = setInterval(() => {
                updatePlot(plotObj.current)
                plotObj.current(d3.select(ref))
            }, 30)    
        } else {
            console.log('clear timer... currently: ', timer.current)
            clearInterval(timer.current)
            timer.current = null
            console.log('timer cleared: ', timer.current)
            setButtonText('start')
        }
    }
  
    return (
      <div className='plot'>
        <div className="plot plot--container">
          <h3 id="animated-ecg-plot">Heartbeat</h3>
          <div className="plot--controls">
          <button className="btn btn-primary" onClick={() => handleClick()}>
            {buttonText}
          </button>
        </div>

          <div className="plot plot--area" ref={ref}></div>
          <div className="plot plot--description">
            <p>Heartbeat is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
          </div>
        </div>
        <div className="plot plot--code">
          <code>
            <CodeBlock content={content}/>
          </code>
        </div>
      </div>
    )
}