let messagePort;

chrome.runtime.onConnect.addListener(function(port){
  messagePort = port;
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.task === 'restart') {
       chrome.runtime.reload();
       sendResponse({message: 'Running chrome.runtime.reload()'});
    }
  });

chrome.tabs.onUpdated.addListener(function(id, data, tab) {
  if (data.status === 'complete') {
    messagePort && messagePort.postMessage({ name: 'tabupdated', tab });
  }
})
