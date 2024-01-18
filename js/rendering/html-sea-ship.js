export default class HtmlSeaShip
{
  #htmlElementModel

  constructor(htmlElementModel)
  {
    htmlElementModel.classList.add('ship')
    this.#htmlElementModel = htmlElementModel
  }

  get htmlElement()
  {
    return this.#htmlElementModel.cloneNode(true)
  }
}
