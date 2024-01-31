import { html } from '../../tags.js'
import HtmlSeaShip from '../html-sea-ship.js';

export default class LongShip extends HtmlSeaShip
{
  constructor()
  {
    super
    (
      document.createElementFromHTML
      (
        html`
          <div class="long-ship">
            <style>
              .long-ship {
                width: 13.5em;
                height: 2em;
                background: var(--default-bg);
                border-radius: 25%;
              }
            </style>
          </div>
        `
      )
    )
  }
}
