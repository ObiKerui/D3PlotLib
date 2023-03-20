import React from 'react'
import ReactDOM from 'react-dom/client'
import { ScatterPlotContainer } from './components/ScatterPlot/ScatterPlot'
import { BarPlotContainer } from './components/BarPlot/BarPlot'
import LinePlot from './components/LinePlot/LinePlot'
import DynamicLinePlot from './components/DoublePlot/DynamicLinePlot'
import GroupedBarPlot from './components/GroupedBarPlot/GroupedBarPlot'
import HistogramPlot from './components/HistogramPlot/HistogramPlot'
import CandlestickPlot from './components/CandlestickPlot/CandlestickPlot'
import StackedbarPlot from './components/StackedBarPlot/StackedBarPlot'
import StackedAreaPlot from './components/StackedAreaPlot/StackedAreaPlot'
import ViolinPlot from './components/ViolinPlot/ViolinPlot'
import { BoxPlotContainer } from './components/BoxPlot/BoxPlot'
import DonutPlot from './components/DonutPlot/DonutPlot'
import HeatmapPlot from './components/HeatmapPlot/HeatmapPlot'
import HeartbeatPlot from './components/HeartbeatPlot/HeartbeatPlot'
import BasicMap from './components/BasicMap/BasicMap'
import HexbinMap from './components/HexbinMap/HexbinMap'
import DensityMap from './components/DensityMap/DensityMap'
import LayerMap from './components/LeafletMap/MapLayers'
// import GoogleMap from './components/GoogleMap/MapLayers'
import Sidebar from './components/Sidebar'

import './index.css'
import './prism.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <aside>
      <Sidebar />
    </aside>
    <main>
      <header>
        <h1>D3PlotLib</h1>
      </header>
      <ScatterPlotContainer />
      <LinePlot />
      <DynamicLinePlot />
      <BarPlotContainer />
      <GroupedBarPlot />
      <HistogramPlot />
      <CandlestickPlot />
      <StackedbarPlot />
      <StackedAreaPlot />
      <ViolinPlot />
      <BoxPlotContainer />
      <DonutPlot />
      <HeatmapPlot />
      <HeartbeatPlot />
      <BasicMap />
      <HexbinMap />
      <DensityMap />
      <LayerMap />
      {/* <GoogleMap /> */}
    </main>
    <footer>
      <p>footer matter</p>
    </footer>
  </React.StrictMode>
)
