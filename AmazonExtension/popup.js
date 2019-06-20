
'use strict';

let topRated = document.getElementById('topRated');
let showNumber = document.getElementById('showNumber');

chrome.storage.local.get('props', function(item) {
    topRated.checked = item.props.checked;
    showNumber.value = item.props.showNumber;
});

topRated.onclick = function(element) {
  update();
};

showNumber.onchange = function(element) {
  update();
};

function update() {
  chrome.storage.local.set({
      props: {
        checked: topRated.checked,
        showNumber: showNumber.value
      }
  });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'topRated.js'});
  });

}
