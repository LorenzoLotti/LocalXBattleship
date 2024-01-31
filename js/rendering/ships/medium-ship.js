import { html } from '../../tags.js'
import HtmlSeaShip from '../html-sea-ship.js';

export default class MediumShip extends HtmlSeaShip
{
  constructor()
  {
    super
    (
      document.createElementFromHTML
      (
        html`
          <div class="medium-ship">
            <style>
              .medium-ship {
                width: 10em;
                height: 2em;
                background: var(--default-bg);
                border-radius: 30%;
              }
            </style>
          </div>
        `
      )
    )
  }
}
