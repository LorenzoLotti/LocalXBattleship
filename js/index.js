import HtmlSeaCell from './html-sea-cell.js'
import Sea from './sea.js'
import HtmlSeaRenderer from './html-sea-renderer.js'

const sea = new Sea('A', 'O', 8, (colChar, rowNumber) =>
{
  const cellElement = document.createElement('div')
  cellElement.classList.add('cell')
  cellElement.textContent = colChar + rowNumber
  return new HtmlSeaCell(cellElement)
})

console.log(sea)
console.log(sea.cells)

new HtmlSeaRenderer(sea, document.querySelector('#sea-container')).render()
