import BPTPresets from './components/presets.js'

window.addEventListener('beforeunload', async function(e){
  chrome.runtime.sendMessage({ task: "restart" });
})

document.querySelector('#host').innerHTML = '<bpt-presets>hello</bpt-presets>'
