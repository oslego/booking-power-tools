const HyperHTMLElement = require('hyperhtml-element');

class StorageInspector extends HyperHTMLElement {
  constructor(state = {}) {
    super()
    this.state = state;
    this.shadow = this.attachShadow({mode: 'open'});
    chrome.storage.onChanged.addListener(this.getStorageContents.bind(this));
  }

  setState(state) {
    this.state = state;
    this.render();
  }

  render() {
    const css = `
      pre{
        outline: 1px solid red;
        width: 500px;
        padding: 10px;
      }
    `;

    return this.html`
      <style>${css}</style>
      <button onclick="${this.clear.bind(this)}">Clear storage</button>
      <pre>${JSON.stringify(this.state, 1, ' ')}</pre>
    `;
  }

  getStorageContents() {
    chrome.storage.local.get(null, function (data) {
      this.setState(data)
    }.bind(this))
  }

  clear() {
    const goAhead = confirm("clear all chrome.storage?");
    if (!goAhead) return

    chrome.storage.local.clear();
    this.render();
  }

  connectedCallback() {
    this.getStorageContents();
  }
}

// Define the new element
customElements.define('chrome-storage-inspector', StorageInspector);

export default StorageInspector;
