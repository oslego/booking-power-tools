import '../vendor/webcomponents-sd-ce.js';
import Presets from './components/presets.js';
import Booking from './booking.js';

(function(){
  const host = document.querySelector(Booking.config.filterContainerSelector);

  if (!host){
    console.warn(`Did not find host: ${Booking.config.filterContainerSelector}`);
    return;
  }

  function onRuntimeMessage(message, sender, callback) {
    const handlers = {
      "tabupdated": onURLChange
    }

    try {
      handlers[message.name].call(this, message)
    } catch (err) {
      // message unhandled
      // console.warn(message, err)
    }
  }

  function onURLChange(data) {
    const url = new URL(data.tab.url)
    presets.setAttribute('value', Booking.getFiltersFromURL(url.search));
  }

  const port = chrome.runtime.connect(chrome.runtime.id);
  port.onMessage.addListener(onRuntimeMessage);

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

  const presets = new Presets({presets: presetsData});

  presets.addEventListener('presetchanged', (e) => {
    const url = Booking.extendURLWithFilters(window.location.toString(), e.detail);
    window.location = url;
  });

  presets.addEventListener('presetcreated', (e) => {});
  presets.addEventListener('presetdeleted', (e) => {});


  // presets.setIntialState({presets: presetsData});
  presets.setAttribute('value', Booking.getFiltersFromURL(window.location.search.toString()));

  host.prepend(presets);

  // Dev mode only. REMOVE BEFORE FLIGHT
  window.addEventListener('beforeunload', function(e){
    chrome.runtime.sendMessage({ task: "restart" });
  })

})()

  // chrome.storage.sync.set({'foo': 'hello', 'bar': 'hi'}, function() {
  //   console.log('Settings saved');
  // });
