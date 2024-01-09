export default class HtmlSeaShip
{
  #htmlElement

  constructor(htmlElement)
  {
    htmlElement.classList.add('ship')
    this.#htmlElement = htmlElement
  }

  get htmlElement()
  {
    return this.#htmlElement
  }
}
