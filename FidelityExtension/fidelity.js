chrome.storage.local.get("props", function (item) {
  let ppdDiv;
  setInterval(() => {
    if (item?.props?.checked === false) {
      return;
    }
	
	let expirationText = document.getElementsByClassName("form-expiration")[0]?.getElementsByClassName("binding-val")[0]?.innerText || undefined;

    let selectedRow = document.getElementsByClassName("grid-row selected")[0] || undefined;
    let premiumText = selectedRow?.getElementsByTagName("div")[1]?.innerText || undefined;
	
	console.log("expirationText", expirationText);
	console.log("premiumText", premiumText);
	
	if(selectedRow && expirationText && premiumText) {
		let today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		let expirationDate = new Date(expirationText);
		expirationDate.setHours(0);
		expirationDate.setMinutes(0);
		expirationDate.setSeconds(0);
		
		let dte = Math.round((expirationDate - today)/(24*60*60*1000)) + 1;
		let premium = Number(premiumText.replace("$", "").replace(" ", ""));
		
		console.log("dte", dte);
		console.log("premium", premium);
		
		let dteAdjustment = today.getDay() - 1;
		let adjustedDTE = dte + dteAdjustment;
		let tradingDTE = (Math.floor(adjustedDTE / 7) * 5) + (adjustedDTE % 7) - dteAdjustment;
		
		//tradingDTE -= (((new Date()).getHours() - 8) / 7);
		
		console.log("tradingDTE", tradingDTE);
		
		if(isNaN(dte) || isNaN(tradingDTE) || isNaN(premium)) {
			selectedRow.lastElementChild.innerHTML = "--";
		} else {
			let ppd = (premium / tradingDTE) * 100;
			if(ppd > 10) {
				ppd = Math.round(ppd);
			} else {
				ppd = ppd.toFixed(2);
			}
			selectedRow.lastElementChild.innerHTML = "$" + ppd + "/day";
		}
	}
  }, 1000);
});
