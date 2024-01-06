import HtmlSeaCell from './html-sea-cell.js'
import Sea from './sea.js'
import HtmlSeaRenderer from './html-sea-renderer.js'

const sea = new Sea('A', 'O', 8, (colChar, rowNumber) =>
{
  const b = document.createElement('button')
  b.style.aspectRatio = '1000/1732'
  b.style.marginInline = "1rem"
  b.style.width = "2rem"
  b.textContent = colChar + rowNumber
  const d = document.createElement('div');
  d.appendChild(b)
  const c = new HtmlSeaCell(d)
  return c
})

console.log(sea)
console.log(sea.cells)

new HtmlSeaRenderer(sea).renderTo(document.querySelector('#sea'))
