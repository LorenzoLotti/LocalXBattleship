import 'https://cdn.jsdelivr.net/npm/long-press-event@2/dist/long-press-event.min.js'
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
    const cellElement = document.createElement('div')
    cellElement.classList.add('cell')
    cellElement.textContent = colChar + rowNumber
    cellElement.setAttribute('data-long-press-delay', 500)
    const cell = new HtmlSeaCell(cellElement);

    cellElement.onclick = () => setTimeout
    (
      () =>
      {
        if (cell.state == 'clear')
          cell.state = 'missed'
      },
      250
    )

    cellElement.ondblclick = () =>
    {
      if (cell.state == 'clear')
        cell.state = 'hit'
    }

    cellElement.addEventListener
    (
      'long-press',
      e =>
      {
        e.preventDefault()

        //if (cell.state != 'clear')
          navigator.vibrate(25);

        cell.state = 'clear'
      }
    );

    return new HtmlSeaCell(cellElement)
  }
)

console.log(JSON.stringify(sea))

const renderer = new HtmlSeaRenderer(sea, document.querySelector('#sea-container'));
let isNextRenderingInverted = false

;(document.querySelector('#swap').onclick = () =>
{
  renderer.render(isNextRenderingInverted, islands)
  isNextRenderingInverted = !isNextRenderingInverted
})()
