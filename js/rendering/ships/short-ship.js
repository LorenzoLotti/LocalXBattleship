import { html } from '../../tags.js'
import HtmlSeaShip from '../html-sea-ship.js';

export default class ShortShip extends HtmlSeaShip
{
  constructor()
  {
    super
    (
      document.createElementFromHTML
      (
        html`
          <div class="small-ship">
            <style>
              .small-ship {
                width: 6em;
                height: 2em;
                background: var(--default-bg);
                border-radius: 32%;
              }
            </style>
          </div>
        `
      )
    )
  }
}
