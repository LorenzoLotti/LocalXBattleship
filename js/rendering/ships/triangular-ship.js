import { html } from '../../tags.js'
import HtmlSeaShip from '../html-sea-ship.js';

export default class TriangularShip extends HtmlSeaShip
{
  constructor()
  {
    super
    (
      document.createElementFromHTML
      (
        html`
          <div class="triangular-ship">
            <style>
              .triangular-ship {
                position: relative;
                background-color: var(--default-bg);
                text-align: left;
              }

              .triangular-ship::before,
              .triangular-ship::after {
                content: '';
                position: absolute;
                background-color: inherit;
              }

              .triangular-ship,
              .triangular-ship::before,
              .triangular-ship::after {
                width:  3.7em;
                height: 3.7em;
                border-top-right-radius: 50%;
              }

              .triangular-ship {
                transform: translate(1.15em, -2.125em)rotate(-60deg) skewX(-30deg) scale(1,.866);
              }

              .triangular-ship::before {
                transform: rotate(-135deg) skewX(-45deg) scale(1.414, .707) translate(0,-50%);
              }

              .triangular-ship::after {
                transform: rotate(135deg) skewY(-45deg) scale(.707, 1.414) translate(50%);
              }
            </style>
          </div>
        `
      )
    )
  }
}
