import BPTPresets from './components/presets.js';
import Booking from './booking.js';

(function(host){
  if (!host){
    console.warn(`Can't find host: ${Booking.config.filterContainerSelector}`)
    return;
  }

  const presets = document.createElement('bpt-presets');
  const presetsData = [
    {
      name: 'Road trip',
      value: 'review_score=80;hotelfacility=2;'
    },
    {
      name: 'Business trip',
      value: 'review_score=80;hotelfacility=107;hr_24=8;'
    }
  ];

  presets.setIntialState({presets: presetsData});
  const nflt = Booking.getFiltersFromURL(window.location.search.toString());
  if (nflt) {
    presets.setAttribute('value', nflt)
  } else {
    presets.removeAttribute('value')
  }
  // presets.setAttribute('filter', Booking.getFiltersFromURL(window.location.search.toString()))

  presets.addEventListener('presetchanged', (e) => {
    const url = Booking.extendURLWithFilters(window.location.toString(), e.detail);
    window.location = url;
  });

  presets.addEventListener('presetcreated', (e) => {});
  presets.addEventListener('presetdeleted', (e) => {});

  const port = chrome.runtime.connect(chrome.runtime.id);
  port.onMessage.addListener(
    function(payload, sender, callback) {
      presets.setAttribute('filters', Booking.getFiltersFromURL(window.location.toString()))
    });

  // Dev mode only. REMOVE BEFORE FLIGHT
  window.addEventListener('beforeunload', async function(e){
    chrome.runtime.sendMessage({ task: "restart" });
  })

  host.prepend(presets);

})(document.querySelector(Booking.config.filterContainerSelector))



  // chrome.storage.sync.set({'foo': 'hello', 'bar': 'hi'}, function() {
  //   console.log('Settings saved');
  // });
