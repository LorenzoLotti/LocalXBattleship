export default class HtmlSeaRenderer
{
  #sea
  #targetContainerHtmlElement

  constructor(sea, targetContainerHtmlElement)
  {
    this.#sea = sea
    this.#targetContainerHtmlElement = targetContainerHtmlElement
  }

  render(isInverted)
  {
    const children = []

    this.#sea.forEachCol
    (
      cells =>
      {
        const colElement = document.createElement('div')
        colElement.classList.add('sea-col')

        for (const cell of cells)
        {
          const cellContainerElement = document.createElement('div')
          cellContainerElement.classList.add('cell-container')
          cellContainerElement.appendChild(cell.htmlElement)
          colElement.appendChild(cellContainerElement)
        }

        children.push(colElement)
      },
      isInverted
    )


    // Hexagonal translation of columns.

    const start = Math.floor(children.length / 2 - children.length % 2)

    for (let i = start; i >= 0; i--)
    {
      const inverseIndex = -i - 1
      const translate = e => e.style.setProperty('--translation', 50 * (start - i + 1) + '%');
      translate(children.at(i))
      translate(children.at(inverseIndex))
    }


    this.#targetContainerHtmlElement.replaceChildren(...children)
  }
}
