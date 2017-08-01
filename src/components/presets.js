// Create a class for the element
class BPTPresets extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    const css = `
      :host{
        font-family: -apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, Helvetica, Arial, sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      .presets {
        outline: 1px solid blue;
        padding: 7px;
      }

      label {
        display: block;
        margin-bottom: 5px;
        padding: 3px 0 2px;
        font-size: 0.9em;
        color: #003580;
        font-weight: bold;
      }

      .button {
        border: none;
        padding: 7px 10px;
        color: white;
        font-weight: 500;
        text-transform: uppercase;
        border-radius: 2px;
        cursor: pointer;
      }

      .button--positive {
        background: #43A047;
      }

      .button--danger {
        background: #D32F2F;
      }

      select {
        width: 100%;
        font-size: 14px;
        margin-bottom: 10px;
      }

      input {
        width: 100%;
        font-size: 14px;
        margin: 0;
      }

      .link {
        color: #07c;
        font-size: 13px;
      }

      .link:hover {
        text-decoration: none;
      }

      .link--quiet,
      .quiet {
        color: #838383;
      }

      .u-center {
        text-align: center;
      }

      .u-hidden {
        display: none;
      }

      .link--quiet:hover{
        color: #444;
      }

      .actionlist {
        display: flex;
        align-items: baseline;
      }

      .actionlist--packed-end {
        justify-content: flex-end;
      }

      .actionlist--spaced {
        justify-content: space-between;
      }

      #or-separator {
        margin: 10px 0;
      }

    `;

    const template = `
      <div class="presets">

        <div id="container-use-preset">
          <label for="use-preset">
            Use saved filters preset:
          </label>
          <select name="preset" id="use-preset" class="preset__dropdown">
            <option value="p0">Budget getaway</option>
            <option value="p1">Road trip</option>
            <option value="p2">Business trip</option>
            <option value="p3">Romantic city break</option>
          </select>
        </div>

        <a href="#" class="link" id="action-show-preset-form">
          Save selected filters as preset
        </a>

        <form id="container-new-preset" class="u-hidden">
          <label for="new-preset">
            Create new preset:
          </label>

          <input type="text" name="new-preset" id="new-preset" placeholder="Name" />

          <div class="quiet u-center" id="or-separator"> - OR - </div>

          <label for="replace-preset">
            Replace existing preset:
          </label>

          <select name="preset" id="replace-preset" class="preset__dropdown">
            <option value="p0">Budget getaway</option>
            <option value="p1">Road trip</option>
            <option value="p2">Business trip</option>
            <option value="p3">Romantic city break</option>
          </select>

          <div class="actionlist actionlist--spaced">
            <a href="#" class="link link--quiet" id="action-cancel-save-preset">
              Cancel
            </a>

            <button class="button button--positive" id="action-save-preset">
              Save
            </button>
          </div>

        </form>

      </div>
    `;

    // Create a shadow root
    var shadow = this.attachShadow({mode: 'open'});

    const style = document.createRange().createContextualFragment(`<style>${css}</style>`);
    const doc = document.createRange().createContextualFragment(template);

    const $ = doc.querySelector.bind(doc);
    const $$ = doc.querySelectorAll.bind(doc);

    const containerNewPreset = $('#container-new-preset');
    const containerUsePreset = $('#container-use-preset');

    const inputNewPreset = $('#new-preset');

    const actionShowPresetForm = $('#action-show-preset-form');
    const actionSavePreset = $('#action-save-preset');
    const actionCancelSavePreset = $('#action-cancel-save-preset');

    actionShowPresetForm.addEventListener('click', (e) => {
      e.preventDefault();
      // Hide prompt to trigger 'new preset' form; hide 'use preset' container
      // Show 'new preset' form.
      [actionShowPresetForm, containerNewPreset, containerUsePreset].map(el => el.classList.toggle('u-hidden'))
      inputNewPreset.focus();
    })

    actionCancelSavePreset.addEventListener('click', (e) => {
      e.preventDefault();
      [actionShowPresetForm, containerNewPreset, containerUsePreset].map(el => el.classList.toggle('u-hidden'))
    })

    actionSavePreset.addEventListener('click', (e) => {
      e.preventDefault();
      [actionShowPresetForm, containerNewPreset, containerUsePreset].map(el => el.classList.toggle('u-hidden'))
    })

    // Add the link to the shadow root.
    shadow.appendChild(style);
    shadow.appendChild(doc);
  }
}

// Define the new element
customElements.define('bpt-presets', BPTPresets);

export default BPTPresets;
