import React from 'react'
import ReactDOM from 'react-dom/client'
import ScatterPlot from './components/ScatterPlot/ScatterPlot'
import BarPlot from './components/BarPlot'
import LinePlot from './components/LinePlot'
import DynamicLinePlot from './components/DynamicLinePlot'
import GroupedBarPlot from './components/GroupedBarPlot'
import HistogramPlot from './components/HistogramPlot'
import CandlestickPlot from './components/CandlestickPlot'
import StackedbarPlot from './components/StackedBarPlot'
import StackedAreaPlot from './components/StackedAreaPlot'
import ViolinPlot from './components/ViolinPlot'
import BoxPlot from './components/BoxPlot'
import DonutPlot from './components/DonutPlot'
import HeatmapPlot from './components/HeatmapPlot'
import HeartbeatPlot from './components/HeartbeatPlot'
import BasicMap from './components/BasicMap'
import HexbinMap from './components/HexbinMap'
import DensityMap from './components/DensityMap'
import LayerMap from './components/MapLayers'
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
      <ScatterPlot />
      <LinePlot />
      <DynamicLinePlot />
      <BarPlot />
      <GroupedBarPlot />
      <HistogramPlot />
      <CandlestickPlot />
      <StackedbarPlot />
      <StackedAreaPlot />
      <ViolinPlot />
      <BoxPlot />
      <DonutPlot />
      <HeatmapPlot />
      <HeartbeatPlot />
      <BasicMap />
      <HexbinMap />
      <DensityMap />
      <LayerMap />
    </main>
    <footer>
      <p>footer matter</p>
    </footer>
  </React.StrictMode>
)
