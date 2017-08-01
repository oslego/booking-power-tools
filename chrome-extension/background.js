chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.task === 'restart') {
       chrome.runtime.reload();
       sendResponse({message: 'Running chrome.runtime.reload()'});
    }
  });
