// MapAttribs/index.ts
"use strict";

declare const d3 : any;
declare const moment : any;
declare const L : any;
declare const $ : any;

export const containerAttrs = {

  map: null as any,
  div: null as any,
  svg: null as any,
  width: 500 as number,
  height : 400 as number,

  margin : {
    bottom: 50,
    left: 40,
    right: 60,
    top: 20,
  },

  mapWidth : 0 as number,
  mapHeight : 0 as number,
  showMargins: false as boolean,
  projector: null as any,
  zoomer: null as any,
  legend: null as any,
  position: null as any,
  zoom: 10 as number,
  accessToken: null as string,
  viewType: null as string
}

export const plotAttrs = {
  tag: null as string,
  geojson: [] as any,
  data: [] as any,
  labels: [] as any,
  plotID: null as String,
  index: null as number,
  alpha: [] as any,
  styles: [] as any,
  colours: [] as any,
  curve: null as any
}

export const lineAttrs = {
  tag: null as string,
  xs: [] as any,
  ys: [] as any,
  lineID: null as String,
  index: null as number,
  alpha: null as number,
  colours: null as String,
  labels: null as String,
  styles: null as String
}
