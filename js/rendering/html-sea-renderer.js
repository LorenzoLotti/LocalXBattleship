import '../extensions.js'
import { html } from '../tags.js'

export default class HtmlSeaRenderer
{
  #sea
  #targetContainerHtmlElement

  constructor(sea, targetContainerHtmlElement)
  {
    this.#sea = sea
    this.#targetContainerHtmlElement = targetContainerHtmlElement
  }

  render(isInverted = false, islands = [])
  {
    const seaElement = document.createElementFromHTML(html`<div class="sea"></div>`)

    let nextRoundingFunction = Math.ceil
    let roundingFunction = Math.floor;

    this.#sea.forEachCol
    (
      (cells, letter) =>
      {
        const colElement = document.createElementFromHTML(html`<div class="sea-col"></div>`)
        const isMiddle = letter == this.#sea.middleLetter

        for (let i = 0; i < cells.length; i++)
        {
          const isBottom = i >= roundingFunction(cells.length / 2 + (isMiddle ? .5 : 0))

          const cellContainerElement = document.createElementFromHTML
          (
            html`
              <div
                class="
                  cell-container
                  ${isBottom ? 'bottom' : 'top'}
                  ${isBottom ^ isInverted ? 'opponent' : 'player'}
                  ${islands.includes(letter + (i + 1)) ? 'island' : 'water'}
                "
              ></div>
            `
          )

          cellContainerElement.appendChild(cells[i].htmlElement)
          colElement.appendChild(cellContainerElement)
        }

        seaElement.appendChild(colElement)

        if (cells.length % 2 != 0 || isMiddle)
          [roundingFunction, nextRoundingFunction] = [nextRoundingFunction, roundingFunction]
      },
      isInverted
    )


    // Columns hexagonal translation.

    const children = [...seaElement.children]
    const start = Math.floor(children.length / 2 - children.length % 2)

    for (let i = start; i >= 0; i--)
    {
      const inverseIndex = -i - 1
      const translate = e => e.style.setProperty('--translation', 50 * (start - i + 1) + '%');
      translate(children.at(i))
      translate(children.at(inverseIndex))
    }


    this.#targetContainerHtmlElement.replaceChildren(seaElement)
  }
}
