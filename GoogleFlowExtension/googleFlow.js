let clickArrowForward = false;
chrome.storage.local.get("props", function (item) {
	let array = [
		"man playing basketball",
		"man riding a bike",
		"man driving a car"
	];
  setInterval(() => {
    if (item?.props?.checked === false) {
      return;
    }
	
	if(array.length > 0) {
		let prompt = array[0];
		
		Array.from(document.getElementsByTagName("button")).filter((el) => el.innerText.indexOf("add_2") >= 0)[0].click();
		
		setTimeout(() => {
			Array.from(document.getElementsByTagName("button")).filter((el) => el.innerText.indexOf("Add to Prompt") >= 0)[0].click();
			
			setTimeout(() => {
				let inputEvent = new InputEvent('beforeinput', {
				  bubbles: true,
				  cancelable: true,
				  inputType: 'insertText',
				  data: prompt
				});

				document.querySelector('[role="textbox"]').dispatchEvent(inputEvent);
				
				setTimeout(() => {
					clickArrowForward = true;
				}, 1000);
			}, 1000);
		}, 1000);
		
		array.splice(0, 1);
	}
	
  }, 30000);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getArrowForwardLocation" && clickArrowForward == true) {
	clickArrowForward = false;
	const rect = Array.from(document.getElementsByTagName("button")).filter((el) => el.innerText.indexOf("arrow_forward") >= 0)[0].getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);
	sendResponse({x: x, y: y});
  } else {
	  sendResponse(false);
  }
});