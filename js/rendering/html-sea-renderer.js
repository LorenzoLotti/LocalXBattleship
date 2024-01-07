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
    const seaElement = document.createElement('div')
    seaElement.classList.add('sea')
    let nextRoundingFunction = Math.ceil
    let roundingFunction = Math.floor;

    this.#sea.forEachCol
    (
      (cells, letter) =>
      {
        const colElement = document.createElement('div')
        colElement.classList.add('sea-col')
        const isMiddle = letter == this.#sea.middleLetter

        for (let i = 0; i < cells.length; i++)
        {
          const cellContainerElement = document.createElement('div')
          cellContainerElement.classList.add('cell-container')
          const isBottom= i >= roundingFunction(cells.length / 2 + (isMiddle ? .5 : 0))

          if (isBottom ^ isInverted)
            cellContainerElement.classList.add('opponent')

          if (islands.includes(letter + (i + 1)))
            cellContainerElement.classList.add('island')

          cellContainerElement.appendChild(cells[i].htmlElement)
          colElement.appendChild(cellContainerElement)
        }

        seaElement.appendChild(colElement)

        if (cells.length % 2 != 0 || isMiddle)
          [roundingFunction, nextRoundingFunction] = [nextRoundingFunction, roundingFunction]
      },
      isInverted
    )


    // Hexagonal translation of columns.

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
