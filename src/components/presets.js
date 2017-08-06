const hyperHTML = require('hyperhtml');
const HyperHTMLElement = require('hyperhtml-element');

// Create a class for the element
class Presets extends HyperHTMLElement {
  constructor(state = {}) {
    // Always call super first in constructor
    super();



    const defaultState = {
      isFormVisible: false,
      isFormValid: false,
      filter: '',
      presetName: '',
      presets: []
    };

    this.state =  Object.assign({}, defaultState, state)

    console.log(this.state);

    // Create a shadow root
    this.shadow = this.attachShadow({mode: 'open'});

    // Delegate events to handleEvent()
    this.shadowRoot.addEventListener('change', this);
    this.shadowRoot.addEventListener('click', this);
  }

 render() {
   const css = `
     :host{
       font-family: -apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, Helvetica, Arial, sans-serif;
     }

     * {
       box-sizing: border-box;
     }

     .presets {
      //  padding: 7px;
       margin-bottom: 20px;
       font-size: 13px;
     }

     label {
       display: block;
       margin-bottom: 5px;
       padding: 3px 0 2px;
       font-size: 14px;
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

     .button[disabled] {
       cursor: default;
       background: silver;
       color: white;
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
       margin-bottom: 10px
     }

     .info {
       background: #eaeaea;
       padding: 5px;
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
       margin-bottm: 0;
     }

     h3 {
       color: #003580;
       padding: 0 0 0 2px;
       margin: 0;
       margin-bottom: 13px;
       font-size: 20px;
       line-height: 28px;
       font-weight: 500
     }
   `;

   return this.html`<style>${css}</style><div class="presets">
       <h3>Filter presets</h3>

       <div>${ (this.state.presets.length === 0) ? this.NoPresetsTemplate() : this.UsePresetTemplate() }</div>

       <div>${ this.NewPresetPromptTemplate() }</div>

       <form id="container-new-preset" class="${this.state.isFormVisible ? '' : 'u-hidden'}" onsubmit="${this.onSaveNewPreset.bind(this)}">
         <label for="new-preset">
           Create new preset:
         </label>

         <input type="text" name="new-preset"
           id="new-preset"
           placeholder="Name"
           value="${this.state.presetName}"
           oninput="${this.definePreset.bind(this)}" />

         <div>${this.ReplacePresetTemplate()}</div>

         <div class="actionlist actionlist--spaced">
           <a href="#" class="link link--quiet" id="action-cancel-save-preset">
             Cancel
           </a>

           <button class="button button--positive" id="action-save-preset" disabled="${this.state.isFormValid ? '' : 'disabled'}">
             Save
           </button>
         </div>

       </form>
     </div>
   `;
 }

 NoPresetsTemplate() {
   return hyperHTML.wire()`
     <p class="${this.state.isFormVisible ? 'u-hidden info quiet' : 'info quiet'}">You do not have any saved filter presets yet.</p>
   `;
 }

 NewPresetPromptTemplate() {
   if (!this.state.filter) {
     return hyperHTML.wire()`<span class="quiet">Select some filters to create a new preset.</span>`;
   }

   return hyperHTML.wire()`<a href="#" class="${this.state.isFormVisible ? 'u-hidden link' : 'link'}" id="action-show-preset-form">
     Save selected filters as preset
   </a>`;
 }

 UsePresetTemplate() {
   if (this.state.presets.length === 0){
     return ''
   }

  return hyperHTML.wire()`<div id="container-use-preset" class="${this.state.isFormVisible ? 'u-hidden' : ''}">
    <label for="use-preset">
      Use preset:
    </label>
    <select name="preset" id="use-preset">
      <option value="">None</option>${
       // this.state.presets.map(preset => return OptionElement(preset))
       this.state.presets.map(preset => {return `<option value="${preset.value}" ${preset.selected ? 'selected' : ''}>${preset.name}</option>`})
    }</select>
  </div>`;
 }

 ReplacePresetTemplate() {
   if (this.state.presets.length === 0){
     return ''
   }

  return hyperHTML.wire()`
  <div class="quiet u-center" id="or-separator"> - OR - </div>
    <label for="replace-preset">
      Replace existing preset:
    </label>

    <select name="preset" id="replace-preset">
      <option value="">None</option>${
       this.state.presets.map(preset => {return `<option value="${preset.value}" ${preset.selected ? 'selected' : ''}>${preset.name}</option>`})
    }</select>
  `;
 }

  // Monitor the attributes for changes.
  static get observedAttributes() { return ['value']; }

  // Respond to attribute changes.
  attributeChangedCallback(attr, oldValue, newValue) {

    // Cast falsy values to explicit null
    newValue = (newValue === "") ? null : newValue;
    newValue = (newValue === "null") ? null : newValue;
    newValue = (newValue === "undefined") ? null : newValue;

    if (attr == 'value') {
      // console.warn('value:', newValue, typeof newValue)

      const clone = Object.assign({}, this.state);
      // Define the current filter as the `value` attribute value.
      clone.filter = newValue;
      // Mark as selected any preset whose value matches the `value` attribute value.
      clone.presets = this.markSelectedPreset(clone.presets, newValue);

      this.setState(clone);
      return;
    }
  }

  setState(state) {
    this.state = state;
    // console.info('State changed:', state)
    this.render();
  }

  /*
    Handler wrapper for UI events originating in this Custom Element.
  */
  handleEvent(e) {
    // console.log(e.type, e.target)

    // Group events by type and map them by target element ID to handler functions
    const handlers = {
      "change": {
        "use-preset": this.changePreset,
        "replace-preset": this.definePreset
      },
      "click": {
        "action-show-preset-form": this.togglePresetForm,
        "action-cancel-save-preset": [this.togglePresetForm, this.resetSelectedPreset]
      }
    }

    // Get any callbacks associated with the event type and element ID
    const cb = handlers[e.type][e.target.id];

    // Wrap single callback to array; empty array if no callback found;
    const cbArr = cb
      ? Array.isArray(cb) ? cb : [cb]
      : [];

    // Run all callbacks for given event type and element ID
    cbArr.map(cb => cb.call(this, e));
  }

  markSelectedPreset(presets, value) {
    return presets.map(preset => {
      preset.selected = (preset.value === value);
      return preset;
    })
  }

  changePreset(e) {
    const detail = e.target.value;
    this.dispatchEvent(new CustomEvent('presetchanged', {detail}))
  }

  resetSelectedPreset() {
    const clone = Object.assign({}, this.state);
    // Mark the selected preset so the right `<option>` element gets selected on render.
    clone.presets = this.markSelectedPreset(clone.presets, this.state.filter);
    this.setState(clone);
  }

  togglePresetForm(e) {
    e.preventDefault();

    const clone = Object.assign({}, this.state);
    clone.isFormVisible = !clone.isFormVisible;
    this.setState(clone);
  }

  definePreset(e) {
    const clone = Object.assign({}, this.state);
    let presetValue = '';

    // If picking a preset from the dropdown, reset the text input
    if (e.target.id === "replace-preset") {
      clone.presetName = '';
      presetValue = e.target.value;
    }

    // If defining a new preset name in the input, reset the dropdown
    if (e.target.id === "new-preset") {
      clone.presetName = e.target.value.trim();
      presetValue = '';
    }

    // Mark the selected preset so the right `<option>` element gets selected on render.
    clone.presets = this.markSelectedPreset(clone.presets, presetValue);

    // If input is empty or the "None" preset is selected, the form can't be submitted.
    clone.isFormValid = e.target.value.trim().length ? true : false;
    this.setState(clone);
  }

  onSaveNewPreset(e) {
    e.preventDefault();

    // Prevent submit if somehow reached here with invalid form.
    if (!this.state.isFormValid) {
      return;
    }

    const clone = Object.assign({}, this.state);

    // Create new preset with value of `this.state.filter`
    if (this.state.presetName.length !== 0) {
      clone.presets.push({
        name: this.state.presetName,
        value: this.state.filter
      });
    } else {
      const index = clone.presets.findIndex(preset => {
        return preset.selected === true;
      })

      if (index !== -1) {
        clone.presets[index].value = this.state.filter
      }
    }

    // Mark the newly created or replaced filter as selected.
    clone.presets = this.markSelectedPreset(clone.presets, this.state.filter);

    clone.presetName = ''
    clone.isFormValid = false;
    clone.isFormVisible = false;

    this.setState(clone);
  }

  connectedCallback() {
    this.render();
  }
}

// Define the new element
customElements.define('bpt-presets', Presets);

export default Presets;
