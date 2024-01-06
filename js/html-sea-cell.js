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

  get isClear()
  {
    return !this.isMissed && !this.isHit
  }

  get isMissed()
  {
    return this.#htmlElement.classList.contains('missed');
  }

  get isHit()
  {
    return this.#htmlElement.classList.contains('hit');
  }

  clear()
  {
    this.#htmlElement.classList.remove('missed', 'hit')
  }

  missed()
  {
    this.empty()
    this.#htmlElement.classList.add('missed')
  }

  hit()
  {
    this.empty()
    this.#htmlElement.classList.add('hit')
  }
}
