import React from 'react'
import ReactDOM from 'react-dom/client'
import ScatterPlot from './components/ScatterPlot/ScatterPlot'
import BarPlot from './components/BarPlot/BarPlot'
import LinePlot from './components/LinePlot/LinePlot'
import DynamicLinePlot from './components/DoublePlot/DynamicLinePlot'
import GroupedBarPlot from './components/GroupedBarPlot/GroupedBarPlot'
import HistogramPlot from './components/HistogramPlot/HistogramPlot'
import CandlestickPlot from './components/CandlestickPlot/CandlestickPlot'
import StackedbarPlot from './components/StackedBarPlot/StackedBarPlot'
import StackedAreaPlot from './components/StackedAreaPlot/StackedAreaPlot'
import ViolinPlot from './components/ViolinPlot/ViolinPlot'
import BoxPlot from './components/BoxPlot/BoxPlot'
import DonutPlot from './components/DonutPlot/DonutPlot'
import HeatmapPlot from './components/HeatmapPlot/HeatmapPlot'
import HeartbeatPlot from './components/HeartbeatPlot/HeartbeatPlot'
import BasicMap from './components/BasicMap/BasicMap'
import HexbinMap from './components/HexbinMap/HexbinMap'
import DensityMap from './components/DensityMap/DensityMap'
import LayerMap from './components/LeafletMap/MapLayers'
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
