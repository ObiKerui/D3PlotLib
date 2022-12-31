import { render, screen } from '@testing-library/react'
import React from 'react'
import BarPlot from './BarPlot'

describe('BarPlot tests', () => {
  it('should render on page', () => {

    const { container } = render(<BarPlot />)

    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement    
    // console.log(svgEl.classList.toString())

    expect(svgEl).toHaveAttribute('width', '500')
    expect(svgEl).toHaveAttribute('height', '400')    
  })
})
