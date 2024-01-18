import { html } from '../tags.js'
import Angle from '../angle.js'

export default class HtmlSeaCell
{
  #injectedShip
  #injectedShipAngleObject
  #htmlElement

  constructor(htmlElement)
  {
    htmlElement.classList.add('cell')
    this.#htmlElement = htmlElement
    this.injectedShip = null
  }

  get #injectedShipElement()
  {
    return this.htmlElement.querySelector('.injected-ship')
  }

  get #injectedShipAngle()
  {
    return this.#injectedShipAngleObject
  }

  set #injectedShipAngle(value)
  {
    this.#injectedShipAngleObject = value

    this.#injectedShipElement?.style.setProperty
    (
      '--angle',
      -this.#injectedShipAngle.degrees + 'deg'
    );
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
    this.#injectedShipElement?.remove()
    this.#injectedShip = value

    if (this.injectedShip != null)
    {
      const element = document.createElementFromHTML(html`<div class="injected-ship"></div>`)
      element.appendChild(this.injectedShip.htmlElement)
      this.htmlElement.appendChild(element)
    }

    this.resetInjectedShipAngle()
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
