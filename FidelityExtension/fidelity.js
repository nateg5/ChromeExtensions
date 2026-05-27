chrome.storage.local.get("props", function (item) {
  let greenHighlight = "#cde1c9";
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
	
	let gridRowHeader = document.getElementsByClassName("grid-row header")[0];
	if(gridRowHeader) {
		gridRowHeader.children[2].innerHTML = "Premium per day";
	}
	
	let gridRows = document.getElementsByClassName("osb-grid")[0]?.getElementsByClassName("grid-row") || undefined;
	
	for(let i = 0; gridRows && i < gridRows.length; i++) {
		let selectedRow = gridRows[i] || undefined;
		let premiumText = selectedRow?.getElementsByTagName("div")[1]?.innerText || undefined;
		
		if(selectedRow && selectedRow.children.length <= 11 && expirationText && premiumText) {			
			let {dte, tradingDTE, premium} = getDTEsAndPremium(expirationText, premiumText);
			
			if(isNaN(dte) || isNaN(tradingDTE) || isNaN(premium)) {
				selectedRow.children[2].innerHTML = "--";
			} else {
				let ppd = calculatePPD(premium, tradingDTE);
				let strike = Number(selectedRow.children[0].innerText);
				let backgroundColor = "";
				if(ppd / strike > .1) {
					backgroundColor = greenHighlight;
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
		let headerRow = document.getElementsByClassName("ag-header-row ag-header-row-column")[0];
		headerRow.children[6].getElementsByClassName("ag-header-cell-text")[0].innerHTML = "Premium per day";
		
		let expirationText = expirationDates[0]?.innerText || undefined;
		if(expirationText && expirationText.indexOf("(W)") >= 0) {
			expirationText = expirationText.replace("(W)", "");
		}
		
		// set max theta, used later for calculating and highlighting max theta
		let maxTheta = 0;

		let gridRows = document.getElementsByClassName("ag-row ag-row-level-1") || undefined;
		
		// pre iterate through row to find the max theta
		for(let i = 0; gridRows && i < gridRows.length; i++) {
			let selectedRow = gridRows[i] || undefined;
			
			if(selectedRow && selectedRow.children.length == 12) {
				let theta = Math.abs(Number(selectedRow.children[11].innerText));
					
				if(theta > maxTheta) {
					maxTheta = theta;
				}
			}
		}
		
		for(let i = 0; gridRows && i < gridRows.length; i++) {
			let selectedRow = gridRows[i] || undefined;
			let premiumText = selectedRow?.getElementsByTagName("div")[5]?.innerText?.replace("Sell at ", "") || undefined;
			
			if(selectedRow && selectedRow.children.length == 12 && expirationText && premiumText) {
				let {dte, tradingDTE, premium} = getDTEsAndPremium(expirationText, premiumText);
				
				if(isNaN(dte) || isNaN(tradingDTE) || isNaN(premium)) {
					selectedRow.children[6].innerHTML = "--";
				} else {
					let ppd = calculatePPD(premium, tradingDTE);
					let strike = Number(selectedRow.children[0].innerText);
					let theta = Math.abs(Number(selectedRow.children[11].innerText));
					
					selectedRow.children[6].innerHTML = "<div>$" + ppd + "/day</div>";
					
					if(ppd / strike > .1) {
						selectedRow.children[6].style.backgroundColor = greenHighlight;
					}
					
					if(theta == maxTheta) {
						selectedRow.children[11].style.backgroundColor = greenHighlight;
					}
				}
			}
		}
	}
	/**/
	
	/**
	 * Positions Page
	 **/
	let titleElement = document.getElementsByClassName("portfolio-dashboard__container-content--title")[0];
	if(titleElement && (titleElement.innerHTML.indexOf("SPY Options") >= 0 || titleElement.innerHTML.indexOf("Stock Options") >= 0)) {
		let leftRows = document.getElementsByClassName("ag-pinned-left-cols-container")[0]?.getElementsByClassName("ag-row");
		let rightRows = document.getElementsByClassName("ag-center-cols-container")[0]?.getElementsByClassName("ag-row");
		
		let optionIndexes = [];
		let optionStrikes = [];
		let optionDates = [];
		for(let i = 0; leftRows && i < leftRows.length; i++) {
			let name = leftRows[i].getElementsByClassName("posweb-cell-symbol-name_container")[0];
			let description = leftRows[i].getElementsByClassName("posweb-cell-symbol-description")[0];
			if(description) {
				let strike = Number(name.innerHTML.split(" ")[1]);
				let date = new Date(description.innerHTML);
				if(date != "Invalid Date" && !isNaN(strike)) {
					optionIndexes.push(i);
					optionStrikes.push(strike);
					optionDates.push(description.innerHTML);
				}
			}
		}
		
		for(let i = 0; rightRows && i < optionIndexes.length; i++) {
			let rowIndex = optionIndexes[i];
			let row = rightRows[rowIndex];
			
			let curVal = row.querySelector("[col-id='curVal']").innerText;
			let qty = row.querySelector("[col-id='qty']").innerText;
			let fifTwo = row.querySelector("[col-id='fifTwo']");
			
			curVal = Number(curVal.replace("$", "").replace(",", ""));
			qty = Number(qty);
			let {dte, tradingDTE} = getDTEsAndPremium(optionDates[i], "");
	
			let remainingPPD = calculatePPD((curVal / qty) / 100, tradingDTE);
			
			if(tradingDTE < 1) {
				leftRows[rowIndex].style.backgroundColor = "#ffc0c0";
			}
			
			if(remainingPPD * 11 < optionStrikes[i]) {
				fifTwo.style.backgroundColor = greenHighlight;
			}
			
			fifTwo.getElementsByClassName("posweb-cell-fifty_two_week_range_container")[0].innerText = "$" + remainingPPD + "/day";
		}
		
		for(let i = 0; rightRows && i < rightRows.length; i++) {
			let row = rightRows[i];
			let qty = row.querySelector("[col-id='qty']")?.innerText || "0";
			let totGLPct = row.querySelector("[col-id='totGLPct']")?.innerText || "0";
			
			qty = Number(qty);
			totGLPct = Number(totGLPct.replace("+", "").replace("%", ""));
			
			if(qty >= 100 && totGLPct > 0) {
				row.querySelector("[col-id='totGLPct']").style.backgroundColor = greenHighlight;
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
		
		let dteAdjustment = today.getDay() - 1;
		let adjustedDTE = dte + dteAdjustment;
		let tradingDTE = (Math.floor(adjustedDTE / 7) * 5) + (adjustedDTE % 7) - dteAdjustment;
		
		let now = new Date();
		let tradingMinutes = (6 * 60) + 30;
		let tradingStart = (8 * 60) + 30;
		let nowTime = (now.getHours() * 60) + now.getMinutes();
		let adjustedNowTime = nowTime - tradingStart;
		if(adjustedNowTime > 0) {
			if(adjustedNowTime < tradingMinutes) {
				tradingDTE -= adjustedNowTime / tradingMinutes;
			} else {
				tradingDTE -= 1;
			}
		}
		
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
