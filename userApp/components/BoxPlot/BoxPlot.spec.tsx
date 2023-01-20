import { render } from '@testing-library/react'
import React from 'react'
import { BoxPlot } from './BoxPlot'

describe('BarPlot tests', () => {
  it('should render on page', async () => {
    const data = await fetch('../../assets/iris.csv')
    const { container } = render(<BoxPlot data={data} />)

    const svgEl = container.querySelector("[class='jschart-container']") as SVGElement
    // console.log(svgEl.classList.toString())

    expect(svgEl).toHaveAttribute('width', '500')
    expect(svgEl).toHaveAttribute('height', '400')
  })
})
