import Angle from '../angle.js'

export default class HtmlSeaCell
{
  #injectedShip
  #injectedShipAngle
  #htmlElement

  constructor(htmlElement)
  {
    this.injectedShip = null
    htmlElement.classList.add('cell')
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

  get injectedShip()
  {
    return this.#injectedShip
  }

  set injectedShip(value)
  {
    this.resetInjectedShipAngle()
    this.#injectedShip = value
  }

  resetInjectedShipAngle()
  {
    this.#injectedShipAngle = new Angle(270)
  }

  #rotateInjectedShipImpl(degrees)
  {
    this.#injectedShipAngle = new Angle(this.#injectedShipAngle.degrees + degrees)
  }

  rotateInjectedShipClockwise()
  {
    this.#rotateInjectedShipImpl(-60)
  }

  rotateInjectedShipCounterclockwise()
  {
    this.#rotateInjectedShipImpl(60)
  }
}
