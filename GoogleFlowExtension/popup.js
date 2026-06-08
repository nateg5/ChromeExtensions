"use strict";

let enabled = document.getElementById("enabled");

chrome.storage.local.get("props", function (item) {
  enabled.checked = item?.props?.checked === false ? false : true;
});

enabled.onclick = function (element) {
  update();
};

function update() {
  chrome.storage.local.set({
    props: {
      checked: enabled.checked,
    },
  });
  chrome.tabs.reload();
}
