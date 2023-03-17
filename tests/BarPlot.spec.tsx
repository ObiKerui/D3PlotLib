import { render, screen } from '@testing-library/react'
import React from 'react'
import { BarPlot } from '../userApp/components/BarPlot/BarPlot'

describe('BarPlot tests', () => {
  it('svg and child group elements should render', () => {
    const { container } = render(<BarPlot data={[]} />)
    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement

    // console.log(svgEl.classList.toString())
    expect(svgEl).not.toBe(null)

    const childElements = svgEl.children as HTMLCollection
    expect(childElements.length).toBe(1)

    const containerGroup = childElements[0]
    expect(containerGroup).toHaveAttribute('transform', 'translate(40,20)')

    const containerGroupChildren = containerGroup.children as HTMLCollection
    const actualClasses = Array.from(containerGroupChildren).map((element) =>
      element.getAttribute('class')
    )

    const expectedClasses = [
      'x-axis-group grid',
      'y-axis-group grid',
      'chart-group',
      'x-axis-group axis',
      'x-axis-label',
      'y-axis-group axis',
      'y-axis-label',
      'metadata-group',
    ]

    expect(expectedClasses).toEqual(actualClasses)
  })

  it('no bar information provided', () => {
    const xs: number[] = []
    const { container } = render(<BarPlot data={[xs]} />)

    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement
    expect(svgEl).not.toBe(null)
  })

  it('the height and width should be set correctly', () => {
    const { container } = render(<BarPlot data={[]} />)
    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement

    // check height and width
    expect(svgEl).toHaveAttribute('width', '500')
    expect(svgEl).toHaveAttribute('height', '400')
  })

  it('should render the x and y axis elements correctly', () => {
    const { container } = render(<BarPlot data={[]} />)
    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement
    const xAxisGroup = svgEl.querySelector("[class='x-axis-label']")
    const yAxisGroup = svgEl.querySelector("[class='y-axis-label']")

    expect(xAxisGroup).not.toBe(null)
    expect(yAxisGroup).not.toBe(null)

    const xAxisGroupText = xAxisGroup?.querySelector("[class='x-axis-label-text']")
    const xText = xAxisGroupText?.textContent
    expect(xText).toEqual('X Axis')

    const yAxisGroupText = yAxisGroup?.querySelector("[class='y-axis-label-text']")
    const yText = yAxisGroupText?.textContent
    expect(yText).toEqual('Y Axis')
  })

  it('should render the correct number of plot elements', () => {
    const { container } = render(<BarPlot data={[]} />)
    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement
    const chartGroup = svgEl.querySelector("[class='chart-group']") as SVGElement

    const containerGroupChildren = chartGroup.children as HTMLCollection
    const actualClasses = Array.from(containerGroupChildren).map((element) =>
      element.getAttribute('class')
    )

    const expectedClasses = ['bars-0', 'line-1', 'clip-path']
    expect(expectedClasses).toEqual(actualClasses)
  })

  it.only('should render the legend correctly', () => {
    const { container } = render(<BarPlot data={[]} />)
    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement
    const metadataGroup = svgEl.querySelector('[class=metadata-group]')

    const containerGroupChildren = metadataGroup?.children as HTMLCollection
    const actualClasses = Array.from(containerGroupChildren).map((element) =>
      element.getAttribute('class')
    )

    console.log('actual classes: ', actualClasses)
    expect(true).toBe(true)

    screen.debug(metadataGroup)

    // get the metadata-group
    // check the g.anchorpoint
    // check the rect attribs
    // check has inner-margin and translate is correct
    // check no. rects correct
    // check no. texts correct
    // check text values correct

    expect(true).toBe(true)
  })
})
