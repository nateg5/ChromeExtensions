
'use strict';

let uncheckAll = document.getElementById('uncheckAll');

uncheckAll.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'uncheckAll.js'});
  });
};

let checkAll = document.getElementById('checkAll');

checkAll.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'checkAll.js'});
  });
};

let checkToggle = document.getElementById('checkToggle');

checkToggle.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'checkToggle.js'});
  });
};
