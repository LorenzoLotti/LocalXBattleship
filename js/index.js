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
      const etest = document.createElementFromHTML(html`<div id="test3">
        <style>
          #test3 {
            width: 10em;
            height: 2em;
            background: var(--default-bg);
            border-radius: 30%;
          }
        </style>
      </div>`);
      cell.injectedShip = new HtmlSeaShip(etest);
      cell.rotateInjectedShipCounterclockwise()
    }

    if (colChar + rowNumber == "E5")
    {
      const etest = document.createElementFromHTML(html`<div id="test4">
        <style>
          #test4 {
            width: 13.5em;
            height: 2em;
            background: var(--default-bg);
            border-radius: 25%;
          }
        </style>
      </div>`);
      cell.injectedShip = new HtmlSeaShip(etest);
    }


    if (colChar + rowNumber == "K7")
    {
      const etest = document.createElementFromHTML(html`<div id="test2">
        <style>
          #test2 {
            width: 6em;
            height: 2em;
            background: var(--default-bg);
            border-radius: 32%;
          }
        </style>
      </div>`);
      cell.injectedShip = new HtmlSeaShip(etest);
    }


    if (colChar + rowNumber == "J2")
    {
      const etest = document.createElementFromHTML(html`<div id="testT">
        <style>
          #testT {
            position: relative;
            background-color: var(--default-bg);
            text-align: left;
          }
          #testT::before,
          #testT::after {
            content: '';
            position: absolute;
            background-color: inherit;
          }
          #testT,
          #testT::before,
          #testT::after {
            width:  3.7em;
            height: 3.7em;
            border-top-right-radius: 50%;
          }

          #testT {
            transform: translate(1.15em, -2.125em)rotate(-60deg) skewX(-30deg) scale(1,.866);
          }
          #testT::before {
            transform: rotate(-135deg) skewX(-45deg) scale(1.414, .707) translate(0,-50%);
          }
          #testT::after {
            transform: rotate(135deg) skewY(-45deg) scale(.707, 1.414) translate(50%);
          }
        </style>
      </div>`);
      cell.injectedShip = new HtmlSeaShip(etest);
    }


    if (colChar + rowNumber == "I10")
    {
      const etest = document.createElementFromHTML(html`<div id="test5">
        <style>
          #test5 {
            width: 7.1em;
            height: 9.25em;
            inset: 0;
            background: var(--default-bg);
            border-radius: 1.2em;
            transform: translate(1.4em, -2.6em) perspective(11em) rotateX(60deg);
          }
        </style>
      </div>`);
      cell.injectedShip = new HtmlSeaShip(etest);
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
