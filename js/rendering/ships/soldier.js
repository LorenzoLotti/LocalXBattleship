import { html } from '../../tags.js'
import HtmlSeaShip from '../html-sea-ship.js';

export default class Soldier extends HtmlSeaShip
{
  constructor()
  {
    super
    (
      document.createElementFromHTML
      (
        html`
          <div class="soldier">
            <style>
              .soldier {
                aspect-ratio: 1 / 1;
                width: 2.33em;
                background: var(--default-bg);
                border-radius: 100%;
              }
            </style>
          </div>
        `
      )
    )
  }
}
