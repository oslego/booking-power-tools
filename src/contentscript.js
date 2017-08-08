import '../vendor/custom-elements.min.js';
import Presets from './components/presets.js';
import Storage from './Storage.js';
import Booking from './Booking.js';
import StorageInspector from './StorageInspector';

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

  // const presetsData = [
  //   {
  //     name: 'Road trip',
  //     value: 'review_score=80;hotelfacility=2;'
  //   },
  //   {
  //     name: 'Business trip',
  //     value: 'review_score=80;hotelfacility=107;hr_24=8;'
  //   }
  // ];

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

      // Inject into to the page
      host.prepend(presetsEl);
    });

  // Dev mode only. REMOVE BEFORE FLIGHT
  window.addEventListener('beforeunload', function(e){
    chrome.runtime.sendMessage({ task: "restart" });
  })

  // Dev mode only. REMOVE BEFORE FLIGHT
  document.body.appendChild(new StorageInspector())

})();
