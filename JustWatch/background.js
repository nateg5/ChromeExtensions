"use strict";

// only needed if there is a popup action in the manifest
/*chrome.runtime.onInstalled.addListener(function () {
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostContains: "justwatch.com",
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});*/
