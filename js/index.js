import 'https://cdn.jsdelivr.net/npm/long-press-event@2/dist/long-press-event.min.js'
import './extensions.js'
import { html } from './tags.js'
import PinchZoom from './pinch-zoom.js'
import HtmlSeaCell from './rendering/html-sea-cell.js'
import Sea from './sea.js'
import HtmlSeaRenderer from './rendering/html-sea-renderer.js'
import ShortShip from './rendering/ships/short-ship.js'
import MediumShip from './rendering/ships/medium-ship.js'
import LongShip from './rendering/ships/long-ship.js'
import AircraftCarrier from './rendering/ships/aircraft-carrier.js'
import TriangularShip from './rendering/ships/triangular-ship.js'
import Soldier from './rendering/ships/soldier.js'

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
        navigator.vibrate(25)

      cell.state = 'clear'
    })

    // Ships tests.

    if (colChar + rowNumber == "E4")
    {
      cell.injectedShip = new MediumShip()
      cell.rotateInjectedShipCounterclockwise()
    }

    if (colChar + rowNumber == "E5")
    {
      cell.injectedShip = new LongShip()
    }

    if (colChar + rowNumber == "K7")
    {
      cell.injectedShip = new ShortShip()
    }

    if (colChar + rowNumber == "J2")
    {
      cell.injectedShip = new TriangularShip()
    }

    if (colChar + rowNumber == "I10")
    {
      cell.injectedShip = new AircraftCarrier()
    }

    if (colChar + rowNumber == "M4")
    {
      cell.injectedShip = new Soldier()
    }

    // END Ship tests.

    return cell
  }
)

const renderer = new HtmlSeaRenderer(document.querySelector('#sea-container'))
let isNextRenderingInverted = false

;(document.querySelector('#swap').onclick = () =>
{
  renderer.render(sea, isNextRenderingInverted, fixedIslands)
  isNextRenderingInverted = !isNextRenderingInverted
})()

for (const pinchZoomElement of document.querySelectorAll('.pinch-zoom'))
  new PinchZoom(pinchZoomElement, { draggableUnzoomed: false, useDoubleTap: false }).enable()
