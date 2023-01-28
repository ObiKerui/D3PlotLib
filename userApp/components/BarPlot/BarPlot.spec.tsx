import { render } from '@testing-library/react'
import React from 'react'
import { BarPlot } from './BarPlot'

describe('BarPlot tests', () => {
  it('should render without error', () => {
    const { container } = render(<BarPlot data={[]} />)
    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement
    expect(svgEl).not.toBe(null)
  })

  it('no bar information provided', () => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8]
    const { container } = render(<BarPlot data={[xs]} />)

    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement

    expect(svgEl).toHaveAttribute('width', '500')
    expect(svgEl).toHaveAttribute('height', '400')
  })

  it('should render on page', () => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8]
    const bars = [4, 5, 6, 6, 6, 7, 8, 9]
    const yLineData = [2, 5]
    const data = [xs, bars, yLineData]

    const { container } = render(<BarPlot data={data} />)

    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement
    // console.log(svgEl.classList.toString())

    expect(svgEl).toHaveAttribute('width', '500')
    expect(svgEl).toHaveAttribute('height', '400')
  })
})
