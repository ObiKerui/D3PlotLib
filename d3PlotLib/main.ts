/* eslint-disable camelcase */

// next phase of development
import p2_Scales from './p2_Scales'
import p2_Container from './p2_Container'
import p2_Plot from './p2_Plot'
import p2_AxLines from './p2_AxLines'
import p2_AyLines from './p2_AyLines'
import p2_BarPlot from './p2_BarPlot'
import p2_GroupedBarPlot from './p2_GroupedBarPlot'
import p2_Histogram from './p2_Histogram'
import p2_Legend from './p2_Legend'
import p2_StackedArea from './p2_StackedArea'
import p2_CandlestickPlot from './p2_CandlestickPlot'
import MovingAverageCalc from './p2_CandlestickPlot/MovingAverageCalc'
import p2_FillArea from './p2_FillArea'
import p2_StackedBar from './p2_StackedBar'
import p2_Boxplot from './p2_Boxplot'
import p2_ViolinPlot from './p2_ViolinPlot'
import p2_Donut from './p2_Donut'
import p2_ScatterPlot from './p2_ScatterPlot'
import p2_Heatmap from './p2_Heatmap'

import p2_MapContainer from './p2_MapContainer '
import p2_MapMarkers from './p2_MapMarkers'
import p2_MapLayer from './p2_MapLayer'

// added for google maps
import p2_GoogleMapContainer from './p2_GoogleMapContainer'
import p2_GoogleMapLayer from './p2_GoogleMapContainer/googleMapLayer'

import p2_devGenericMapContainer from './p2_devGenericMapContainer'
import p2_devGenericProjection from './p2_devGenericProjection'
import p2_devGenericMapLayer from './p2_devGenericMapLayer'
import p2_devGenericMapMarkers from './p2_devGenericMapMarkers'
import p2_devHexBinLayer from './p2_devHexBinLayer'
import p2_devZoom from './p2_devZoom'
import p2_devLabels from './p2_devLabels'
import p2_Brush from './p2_Brush'

export {
  // phase 2
  p2_Container as Container,
  p2_Scales as Scaler,
  p2_Plot as Plot,
  p2_AxLines as AxLine,
  p2_AyLines as AyLine,
  p2_BarPlot as BarPlot,
  p2_GroupedBarPlot as GroupedBarPlot,
  p2_Histogram as Hist,
  p2_Legend as Legend,
  p2_StackedArea as StackedArea,
  p2_StackedBar as StackedBar,
  p2_CandlestickPlot as CandlestickPlot,
  MovingAverageCalc,
  p2_Boxplot as BoxPlot,
  p2_ViolinPlot as ViolinPlot,
  p2_FillArea as FillArea,
  p2_Donut as DonutPlot,
  p2_ScatterPlot as ScatterPlot,
  p2_Heatmap as Heatmap,
  // phase 3
  p2_GoogleMapContainer as GoogleMapContainer,
  p2_GoogleMapLayer as GoogleMapLayer,
  p2_MapContainer as MapContainer,
  p2_MapMarkers as MapMarkers,
  p2_MapLayer as MapLayer,
  p2_devGenericMapContainer as DevMapContainer,
  p2_devGenericProjection as DevMapProjection,
  p2_devGenericMapLayer as DevMapLayer,
  p2_devGenericMapMarkers as DevMapMarkers,
  p2_devHexBinLayer as DevHexBinLayer,
  p2_devZoom as DevZoom,
  p2_devLabels as DevLabels,
  p2_Brush as DevBrush,
}
