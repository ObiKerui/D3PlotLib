import { render } from '@testing-library/react'
import React from 'react'
import BoxPlot from './BoxPlot'

describe('BarPlot tests', () => {
  it('should render on page', () => {
    const { container } = render(<BoxPlot />)

    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement
    // console.log(svgEl.classList.toString())

    expect(svgEl).toHaveAttribute('width', '500')
    expect(svgEl).toHaveAttribute('height', '400')
  })
})
