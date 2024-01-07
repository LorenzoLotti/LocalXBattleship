export default class HtmlSeaCell
{
  #htmlElement

  constructor(htmlElement)
  {
    this.#htmlElement = htmlElement
  }

  get htmlElement()
  {
    return this.#htmlElement
  }

  get state()
  {
    if (this.#htmlElement.classList.contains('missed'))
      return 'missed'

    if (this.#htmlElement.classList.contains('hit'))
      return 'hit'

    return 'clear'
  }

  set state(value)
  {
    this.#htmlElement.classList.remove('missed', 'hit')

    if (value == 'missed' || value == 'hit')
      this.#htmlElement.classList.add(value)
  }
}
