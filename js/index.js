import 'https://cdn.jsdelivr.net/npm/long-press-event@2/dist/long-press-event.min.js'
import './extensions.js'
import { html } from './tags.js'
import PinchZoom from './pinch-zoom.js'
import HtmlSeaCell from './rendering/html-sea-cell.js'
import Sea from './sea.js'
import HtmlSeaRenderer from './rendering/html-sea-renderer.js'

const islands =
[
  'G1',
  'G5',
  'C4',
  'L2',
  'M4',
  'C7',
  'G10',
  'G14',
  'J7',
  'L10'
]

const sea = new Sea
(
  'A',
  'O',
  8,
  (colChar, rowNumber) =>
  {
    const cellElement = document.createElementFromHTML
    (
      html`
        <div data-long-press-delay="500">
          ${colChar + rowNumber}
        </div>
      `
    )

    const cell = new HtmlSeaCell(cellElement);

    cellElement.addEventListener('click', () => setTimeout
    (
      () =>
      {
        if (cell.state == 'clear')
          cell.state = 'missed'
      },
      250
    ))

    cellElement.addEventListener('dblclick', () =>
    {
      if (cell.state == 'clear')
        cell.state = 'hit'
    })

    cellElement.addEventListener('long-press', e =>
    {
      e.preventDefault()

      if (cell.state != 'clear')
        navigator.vibrate(25);

      cell.state = 'clear'
    })

    return new HtmlSeaCell(cellElement)
  }
)

const renderer = new HtmlSeaRenderer(sea, document.querySelector('#sea-container'));
let isNextRenderingInverted = false

;(document.querySelector('#swap').onclick = () =>
{
  renderer.render(isNextRenderingInverted, islands)
  isNextRenderingInverted = !isNextRenderingInverted
})()

new PinchZoom(document.querySelector('.inner'), {draggableUnzoomed: false, useDoubleTap: false})
