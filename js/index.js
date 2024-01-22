import 'https://cdn.jsdelivr.net/npm/long-press-event@2/dist/long-press-event.min.js'
import './extensions.js'
import { html } from './tags.js'
import PinchZoom from './pinch-zoom.js'
import HtmlSeaCell from './rendering/html-sea-cell.js'
import Sea from './sea.js'
import HtmlSeaRenderer from './rendering/html-sea-renderer.js'
import HtmlSeaShip from './rendering/html-sea-ship.js';

const fixedIslands =
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
          <div class="cell-hexagon">
            ${colChar + rowNumber}
          </div>
        </div>
      `
    )

    const cell = new HtmlSeaCell(cellElement)

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


    if (colChar + rowNumber == "E4")
    {
      const etest = document.createElementFromHTML(html`<div id="test">
        <style>
          #test {
            width: 10em;
            height: 2em;
            margin-left: -1.2em;
            background-color: #555;
            border-radius: 30%;
            box-shadow: var(--hexagons-items-shadow)
          }
        </style>
      </div>`);
      cell.injectedShip = new HtmlSeaShip(etest);
      cell.rotateInjectedShipClockwise()
      cell.rotateInjectedShipClockwise()
    }

    return cell
  }
)

const renderer = new HtmlSeaRenderer(document.querySelector('#sea-container'));
let isNextRenderingInverted = false

;(document.querySelector('#swap').onclick = () =>
{
  renderer.render(sea, isNextRenderingInverted, fixedIslands)
  isNextRenderingInverted = !isNextRenderingInverted
})()

for (const pinchZoomElement of document.querySelectorAll('.pinch-zoom'))
  new PinchZoom(pinchZoomElement, { draggableUnzoomed: false, useDoubleTap: false }).enable()
