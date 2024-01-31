import { html } from '../../tags.js'
import HtmlSeaShip from '../html-sea-ship.js';

export default class AircraftCarrier extends HtmlSeaShip
{
  constructor()
  {
    super
    (
      document.createElementFromHTML
      (
        html`
          <div class="aircraft-carrier">
            <style>
              .aircraft-carrier {
                width: 7.1em;
                height: 9.25em;
                inset: 0;
                background: var(--default-bg);
                border-radius: 1.2em;
                transform: translate(1.4em, -2.6em) perspective(11em) rotateX(60deg);
              }
            </style>
          </div>
        `
      )
    )
  }
}
