export default class HtmlSeaRenderer
{
  #sea

  constructor(sea)
  {
    this.#sea = sea
  }

  renderTo(htmlElement, isInverted)
  {
    const children = []

    this.#sea.forEachCol
    (
      cells =>
      {
        const div = document.createElement('div')

        for (const cell of cells)
          div.append(cell.htmlElement)

        children.push(div)
      },
      isInverted
    )

    const start = Math.floor(children.length / 2 - children.length % 2)

    for (let i = start; i >= 0; i--)
    {
      const inverseIndex = -i - 1
      const translate = e => e.style.setProperty('--translation', 50 * (start - i + 1) + '%');
      translate(children.at(i))
      translate(children.at(inverseIndex))
    }

    htmlElement.replaceChildren(...children)
  }
}
