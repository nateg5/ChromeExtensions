chrome.storage.local.get("props", function (item) {
  let ppdDiv;
  setInterval(() => {
    if (item?.props?.checked === false) {
      return;
    }
	
	/**
	 * Option Strategy Builder Page
	 **/
	let expirationText = document.getElementsByClassName("form-expiration")[0]?.getElementsByClassName("binding-val")[0]?.innerText || undefined;
	if(expirationText) {
		expirationText = expirationText.replace(" AM", "").replace(" PM", "");
	}
	
	let gridRows = document.getElementsByClassName("osb-grid")[0]?.getElementsByClassName("grid-row") || undefined;
	
	for(let i = 0; gridRows && i < gridRows.length; i++) {
		let selectedRow = gridRows[i] || undefined;
		let premiumText = selectedRow?.getElementsByTagName("div")[1]?.innerText || undefined;
		
		console.log("expirationText", expirationText);
		console.log("premiumText", premiumText);
		
		if(selectedRow && selectedRow.children.length <= 11 && expirationText && premiumText) {			
			let {dte, tradingDTE, premium} = getDTEsAndPremium(expirationText, premiumText);
			
			if(isNaN(dte) || isNaN(tradingDTE) || isNaN(premium)) {
				selectedRow.children[2].innerHTML = "--";
			} else {
				let ppd = calculatePPD(premium, tradingDTE);
				let strike = Number(selectedRow.children[0].innerText);
				let backgroundColor = "#ffffff";
				if(ppd / strike > .1) {
					backgroundColor = "#cde1c9";
				}
				selectedRow.children[2].innerHTML = "<div style='background-color: " + backgroundColor + "; padding-left: 10px;'>$" + ppd + "/day</div>";
			}
		}
	}
	/**/
	
	/**
	 * Option Chain Page
	 **/
	let expirationDates = document.getElementsByClassName("expiration-date");
	
	if(expirationDates.length == 1) {
		let expirationText = expirationDates[0]?.innerText || undefined;
		if(expirationText && expirationText.indexOf("(W)") >= 0) {
			expirationText = expirationText.replace("(W)", "");
		}
		
		let gridRows = document.getElementsByClassName("ag-row ag-row-level-1") || undefined;
		
		for(let i = 0; gridRows && i < gridRows.length; i++) {
			let selectedRow = gridRows[i] || undefined;
			let premiumText = selectedRow?.getElementsByTagName("div")[5]?.innerText?.replace("Sell at ", "") || undefined;
			
			console.log("expirationText", expirationText);
			console.log("premiumText", premiumText);
			
			if(selectedRow && selectedRow.children.length <= 11 && expirationText && premiumText) {
				let {dte, tradingDTE, premium} = getDTEsAndPremium(expirationText, premiumText);
				
				if(isNaN(dte) || isNaN(tradingDTE) || isNaN(premium)) {
					selectedRow.children[6].innerHTML = "--";
				} else {
					let ppd = calculatePPD(premium, tradingDTE);
					let strike = Number(selectedRow.children[0].innerText);
					let backgroundColor = "#ffffff";
					if(ppd / strike > .1) {
						backgroundColor = "#cde1c9";
					}
					selectedRow.children[6].innerHTML = "<div style='background-color: " + backgroundColor + ";'>$" + ppd + "/day</div>";
				}
			}
		}
	}
	/**/
  }, 1000);
  let getDTEsAndPremium = (expirationText, premiumText) => {
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
		
		return {dte, tradingDTE, premium};
  };
  let calculatePPD = (premium, tradingDTE) => {
		let ppd = (premium * 100) / tradingDTE;
		if(ppd > 10) {
			ppd = Math.floor(ppd);
		} else {
			ppd = ppd.toFixed(2);
		}
		
		return ppd;
  };
});
