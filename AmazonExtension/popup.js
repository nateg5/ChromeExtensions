
'use strict';

let topRated = document.getElementById('topRated');

chrome.storage.local.get('checked', function(item) {
    document.getElementById('topRated').checked = item.checked;
});

topRated.onclick = function(element) {
  chrome.storage.local.set({
      checked: element.target.checked
  });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'topRated.js'});
  });
};
