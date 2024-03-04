import 'https://cdn.jsdelivr.net/npm/long-press-event@2/dist/long-press-event.min.js'
import './extensions.js'
import { html } from './tags.js'
import GameState from './game-state.js'
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

let selectedShipModel = null
let gameState = new GameState('swapping', document.documentElement);

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

const defaultShips =
[
  {
    model: new ShortShip(),
    name: 'Short ship',
    size: 2
  },
  {
    model: new MediumShip(),
    name: 'Medium ship',
    size: 3
  },
  {
    model: new LongShip(),
    name: 'Long ship',
    size: 4
  },
  {
    model: new TriangularShip(),
    name: 'Triangular ship',
    size: 3
  },
  {
    model: new AircraftCarrier(),
    name: 'Aircraft carrier',
    size: 5
  },
  {
    model: new Soldier(),
    name: 'Soldier',
    size: 1
  }
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
        switch (gameState.read())
        {
          case 'placing':
            if (cell.injectedShip != null)
              break

            cell.injectedShip = selectedShipModel
            deselectAllShipButtons()
            selectedShipModel = null
            break

          case 'playing':
            if (cell.state == 'clear')
              cell.state = 'missed'

            break
        }
      },
      250
    ))

    cellElement.addEventListener('dblclick', () =>
    {
      switch (gameState.read())
      {
        case 'placing':
          cell.rotateInjectedShipCounterclockwise()
          break

        case 'playing':
          if (cell.state == 'clear')
            cell.state = 'hit'

          break
      }
    })

    cellElement.addEventListener('long-press', e =>
    {
      e.preventDefault()

      switch (gameState.read())
      {
        case 'placing':
          if (cell.injectedShip != null)
            navigator.vibrate(25)

          cell.injectedShip = null
          break

        case 'playing':
          if (cell.state != 'clear')
            navigator.vibrate(25)

          cell.state = 'clear'
          break
      }
    })

    // Ships tests.
    /*

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
    */
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

document.querySelector('#swap-done').addEventListener('click', () => gameState.set('placing'));

for (const pinchZoomElement of document.querySelectorAll('.pinch-zoom'))
  new PinchZoom(pinchZoomElement, { draggableUnzoomed: false, useDoubleTap: false }).enable()

const shipSelector = document.querySelector('#ship-selector');

for (const ship of defaultShips)
{
  const button = document.createElementFromHTML
  (
    html`
      <button>
        ${ship.name}
        <i class="bi bi-${ship.size}-circle-fill"></i>
      </button>
    `
  )

  button.addEventListener('click', () =>
  {
    deselectAllShipButtons()
    button.classList.add('selected')
    selectedShipModel = ship.model
  })

  shipSelector.appendChild(button)
}

function deselectAllShipButtons()
{
  for (const button of shipSelector.querySelectorAll('button'))
    button.classList.remove('selected')
}

document
  .querySelector('#ship-placing-done')
  .addEventListener('click', () => gameState.set('playing'));

const footer = document.querySelector('footer');
const inputColor = footer.querySelector('input[type=color]')

if (localStorage.footerColor != null)
  inputColor.value = localStorage.footerColor

;(inputColor.oninput = () =>
{
  const hexColor = inputColor.value
  const rgbColor = toRGB(hexColor)
  const brightness = getBrightness(rgbColor.red, rgbColor.green, rgbColor.blue)

  if (brightness < 16)
  {
    inputColor.value = localStorage.footerColor
    return
  }

  localStorage.footerColor = hexColor
  footer.style.setProperty('--main-color', hexColor)
  footer.style.setProperty('--base-color', brightness >= 127.5 ? 'black' : 'white' )
})()

document
  .querySelector('#scroll-right')
  .addEventListener
  (
    'click',
    () => footerScrollToButton(b => b.getBoundingClientRect().right > innerWidth)
  )

document
  .querySelector('#scroll-left')
  .addEventListener
  (
    'click',
    () => footerScrollToButton(b => b.getBoundingClientRect().left < 0, true)
  )

function footerScrollToButton(predicate, isRightToLeft = false)
{
  let buttons = footer.querySelectorAll(`.${gameState.read()} button`);

  if (isRightToLeft)
    buttons = [...buttons].reverse()

  for (const button of buttons)
  {
    if (predicate(button))
    {
      button.scrollIntoView()
      break
    }
  }
}

function toRGB(hex)
{
  return {
    red: parseInt(hex.substring(1, 3), 16),
    green: parseInt(hex.substring(3, 5), 16),
    blue: parseInt(hex.substring(5, 7), 16)
  }
}

// https://www.w3.org/TR/AERT/#color-contrast
function getBrightness(red, green, blue)
{
  return red * .299 + green * .587 + blue * .114
}
