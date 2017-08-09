import '../vendor/custom-elements.min.js';
import Presets from './components/Presets.js';
import Storage from './Storage.js';
import Booking from './Booking.js';

(function(){
  const host = document.querySelector(Booking.config.filterContainerSelector);

  if (!host){
    console.warn(`Did not find host: ${Booking.config.filterContainerSelector}`);
    return;
  }

  function onRuntimeMessage(message, sender, callback) {
    const handlers = {
      "tabupdated": function() { window.dispatchEvent(new CustomEvent('locationchange', {detail: message.tab.url }))}
    }

    try {
      handlers[message.name].call(this, message)
    } catch (err) {
      // message unhandled
      // console.warn(message, err)
    }
  }

  const port = chrome.runtime.connect(chrome.runtime.id);
  port.onMessage.addListener(onRuntimeMessage);

  Storage.get(['presets'])
    .then(data => {
      return new Presets(data);
    })
    .catch(err => {
      console.warn(err)
      return new Presets();
    })
    // extra .then() after .catch() instead of unsupported .finally()
    // presetsEl is the Presets DOM element instance
    .then(presetsEl => {

      presetsEl.addEventListener('presetselected', (e) => {
        presetsEl.setAttribute('in-progress', true);
        const url = Booking.extendURLWithFilters(window.location.toString(), e.detail);
        window.location = url;
      });

      presetsEl.addEventListener('presetlistupdated', (e) => {
        Storage.set({presets: e.detail});
      });

      presetsEl.setAttribute('value', Booking.getFiltersFromURL(window.location.search.toString()));

      window.addEventListener('locationchange', e => {
        presetsEl.setAttribute('value', Booking.getFiltersFromURL( new URL(e.detail).search ));
      })

      // Inject Presets element into to the page
      host.prepend(presetsEl);

      /*
      IMPORTANT:

      Booking.com uses a capture phase keydown event handler on <body>
      to move focus inside the hotel search input field if document.activeElement
      is not of tagName INPUT, TEXTAREA, or SELECT.

      ShadowDOM eats focus of any nested input and causes document.activeElement
      to be our Presets custom element, thus failing the Booking.com check for tagName.
      @see https://medium.com/dev-channel/focus-inside-shadow-dom-78e8a575b73

      To counteract this we one-up the Booking.com capture event handler
      and prevent the keydown event from reaching it if the target is our Presets custom element.

      Yes, it's a "Trace Buster Buster" situation https://www.youtube.com/watch?v=Iw3G80bplTg
      */
      document.body.addEventListener('keydown', e => {
        if (e.target === presetsEl) {
          e.stopImmediatePropagation();
        }
      }, { useCapture:true });
    });

  // The following snippet is removed automatically from production builds.
  if(DEV_MODE) {
    console.log('Development mode ON');

    window.addEventListener('beforeunload', function(e){
      chrome.runtime.sendMessage({ task: "restart" });
    });

    const StorageInspector = require('./StorageInspector');
    document.body.appendChild(new StorageInspector.default())
  }

})();
