import { scaleAttrs, containerAttrs, axisAttrs } from '../ChartAttribs'

const publicAttributes = {
  ...scaleAttrs,
  ...containerAttrs,
  ...axisAttrs,
}

type containerObj = typeof publicAttributes | null

function LabelGenerator() {
  let obj: containerObj = null

  /**
   * Draws the x and y axis custom labels respective groups
   * @private
   */
  function drawAxisLabels() {
    // .append("text")
    // .attr("y", 6)
    // .attr("dy", "2.0em")
    // .attr("x", 100)
    // .style("fill", "black")
    // .text("hello")

    let yAxisShift = 0
    if (obj.yAxisPosition === 'right') {
      yAxisShift = obj.chartWidth + 80
    }

    if (obj.yAxisLabel) {
      if (obj.yAxisLabelEl) {
        obj.yAxisLabelEl.remove()
      }

      obj.yAxisLabelEl = obj.svg
        .select('.y-axis-label')
        .attr('transform', `translate(${yAxisShift}, 0)`)
        .append('text')
        .classed('y-axis-label-text', true)
        .attr('x', -obj.chartHeight / 2)
        .attr('y', obj.yAxisLabelOffset)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(270 0 0)')
        .text(obj.yAxisLabel)
    }

    if (obj.xAxisLabel) {
      if (obj.xAxisLabelEl) {
        obj.xAxisLabelEl.remove()
      }

      obj.xAxisLabelEl = obj.svg
        .select('.x-axis-label')
        .attr('transform', `translate(0,${obj.chartHeight})`)
        .append('text')
        .attr('y', obj.xAxisLabelOffset)
        .attr('text-anchor', 'middle')
        .classed('x-axis-label-text', true)
        .attr('x', obj.chartWidth / 2)
        .text(obj.xAxisLabel)
    }
  }

  function toExport(container: containerObj) {
    obj = container
    drawAxisLabels()
  }
  return toExport
}

export default LabelGenerator
