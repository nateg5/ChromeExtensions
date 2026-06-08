"use strict";

/*chrome.runtime.onInstalled.addListener(function () {
  chrome.action.disable();
});*/

setInterval(() => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if(tabs && tabs.length > 0) {
			console.log("tabid", tabs[0].id);
			const activeTabId = tabs[0].id;
			chrome.tabs.sendMessage(activeTabId, { action: "getArrowForwardLocation" }, (response) => {
				if(response) {
					simulateClick(activeTabId, response.x, response.y);
				}
			});
		}
	});
}, 1000);

async function simulateClick(tabId, x, y) {
  const protocolVersion = "1.3";
  const debuggee = { tabId: tabId };

  try {
    // 1. Attach the debugger to the tab
    await chrome.debugger.attach(debuggee, protocolVersion);

    // 2. Dispatch Mouse Pressed
    await chrome.debugger.sendCommand(debuggee, "Input.dispatchMouseEvent", {
      type: "mousePressed",
      x: x,
      y: y,
      button: "left",
      clickCount: 1
    });

    // 3. Dispatch Mouse Released
    await chrome.debugger.sendCommand(debuggee, "Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: x,
      y: y,
      button: "left",
      clickCount: 1
    });

    console.log(`Successfully clicked at (${x}, ${y})`);
  } catch (error) {
    console.error("Debugger Error:", error);
  } finally {
    // 4. Always detach when finished
    await chrome.debugger.detach(debuggee);
  }
}