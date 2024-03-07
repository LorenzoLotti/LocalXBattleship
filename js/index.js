import 'https://cdn.jsdelivr.net/npm/long-press-event@2/dist/long-press-event.min.js'
import './extensions.js'
import { html } from './tags.js'
import GameState from './game-state.js'
import LocalStorageBox from './local-storage-box.js'
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

const persistentData = new LocalStorageBox('persistent-data')
const sessionData = new LocalStorageBox('session')

const gameState = new GameState
(
  sessionData.getOrSetItem('game-state', 'swapping'),
  document.documentElement,
  state => sessionData.setItem('game-state', state)
);

let selectedShipModel = null

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
{
  'short':
  {
    model: new ShortShip(),
    name: 'Short ship',
    size: 2
  },

  'medium':
  {
    model: new MediumShip(),
    name: 'Medium ship',
    size: 3
  },

  'long':
  {
    model: new LongShip(),
    name: 'Long ship',
    size: 4
  },

  'triangular':
  {
    model: new TriangularShip(),
    name: 'Triangular ship',
    size: 3
  },

  'aircraft-carrier':
  {
    model: new AircraftCarrier(),
    name: 'Aircraft carrier',
    size: 5
  },

  'soldier':
  {
    model: new Soldier(),
    name: 'Soldier',
    size: 1
  }
}

function getShipIdByModel(model)
{
  for (const id in defaultShips)
    if (model == defaultShips[id].model)
      return id

  return null
}

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

    const cell = new HtmlSeaCell
    (
      cellElement,
      state => sessionData.setItem(`cell-${colChar}${rowNumber}-state`, state)
    )

    cellElement.addEventListener('click', () => setTimeout
    (
      () =>
      {
        switch (gameState.read())
        {
          case 'placing':
            if (cell.injectedShip != null)
              break

            injectShip(cell, selectedShipModel, colChar, rowNumber)
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

          sessionData.updateItem
          (
            `cell-${colChar}${rowNumber}-injected-ship-rotations`,
            value => value + 1
          )

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
            navigator.vibrate?.(25)

          injectShip(cell, null, colChar, rowNumber)
          break

        case 'playing':
          if (cell.state != 'clear')
            navigator.vibrate?.(25)

          cell.state = 'clear'
          break
      }
    })

    restoreCell(cell, colChar, rowNumber)
    return cell
  }
)

function injectShip(cell, model, colChar, rowNumber)
{
  cell.injectedShip = model
  const cellSessionKeyPrefix =  `cell-${colChar}${rowNumber}-`
  const shipSessionKey = cellSessionKeyPrefix + 'injected-ship';
  const rotationsSessionKey = cellSessionKeyPrefix + 'injected-ship-rotations';

  if (model == null)
  {
    sessionData.removeItem(shipSessionKey)
    sessionData.removeItem(rotationsSessionKey)
    return
  }

  sessionData.setItem(shipSessionKey, getShipIdByModel(model))
  sessionData.setItemIfNotExists(rotationsSessionKey, 0)
}

function restoreCell(cell, colChar, rowNumber)
{
  const
    cellSessionKeyPrefix =  `cell-${colChar}${rowNumber}-`,
    cellStateSessionKey = cellSessionKeyPrefix + 'state',
    shipSessionKey = cellSessionKeyPrefix + 'injected-ship';

  if (sessionData.hasItem(cellStateSessionKey))
    cell.state = sessionData.getItem(cellStateSessionKey)

  if (sessionData.hasItem(shipSessionKey))
  {
    const shipModel = defaultShips[sessionData.getItem(shipSessionKey)].model
    injectShip(cell, shipModel, colChar, rowNumber)
    const rotations = sessionData.getItem(`cell-${colChar}${rowNumber}-injected-ship-rotations`);

    for (let i = 0; i < rotations; i++)
      cell.rotateInjectedShipCounterclockwise()
  }
}



// Rendering (sea swapping).

const renderer = new HtmlSeaRenderer(document.querySelector('#sea-container'))
let isNextRenderingInverted = persistentData.getItem('is-inverted') ?? false

;(document.querySelector('#swap').onclick = () =>
{
  persistentData.setItem('is-inverted', isNextRenderingInverted)
  renderer.render(sea, isNextRenderingInverted, fixedIslands)
  isNextRenderingInverted = !isNextRenderingInverted
})()

for (const pinchZoomElement of document.querySelectorAll('.pinch-zoom'))
  new PinchZoom(pinchZoomElement, { draggableUnzoomed: false, useDoubleTap: false }).enable()



// Next game state.
document.querySelector('#swap-done').addEventListener('click', () => gameState.set('placing'));



// Ships placing.

const shipSelector = document.querySelector('#ship-selector');

for (const shipId in defaultShips)
{
  const ship = defaultShips[shipId]

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
  for (const button of shipSelector.querySelectorAll('button.selected'))
    button.classList.remove('selected')
}



// Next game state.
document
  .querySelector('#ship-placing-done')
  .addEventListener('click', () => gameState.set('playing'));



// Footer coloring and scrolling.

const footer = document.querySelector('footer');
const inputColor = footer.querySelector('input[type=color]')

if (persistentData.hasItem('footer-color'))
  inputColor.value = persistentData.getItem('footer-color')

;(inputColor.oninput = () =>
{
  const hexColor = inputColor.value
  const rgbColor = toRGB(hexColor)
  const brightness = getBrightness(rgbColor.red, rgbColor.green, rgbColor.blue)

  if (brightness < 16)
  {
    inputColor.value = persistentData.getItem('footer-color')
    return
  }

  persistentData.setItem('footer-color', hexColor)
  footer.style.setProperty('--main-color', hexColor)
  footer.style.setProperty('--base-color', brightness >= 127.5 ? 'black' : 'white' )
})()

document
  .querySelector('#color-picker')
  .addEventListener('long-press', e =>
  {
    e.preventDefault()
    persistentData.removeItem('footer-color')
    location.reload()
  })

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

function getBrightness(red, green, blue)
{
  // https://www.w3.org/TR/AERT/#color-contrast
  return red * .299 + green * .587 + blue * .114
}



// Restart.
document
  .querySelector('#restart')
  .addEventListener('click', () =>
  {
    sessionData.clear()
    location.reload()
  })
