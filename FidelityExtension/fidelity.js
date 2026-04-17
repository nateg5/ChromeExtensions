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
				
				backgroundColor = "#ffffff";
				if(premium * 1000 > strike) {
					backgroundColor = "#cde1c9";
				}
				selectedRow.children[1].innerHTML = "<div style='background-color: " + backgroundColor + "; padding-left: 10px;'><span _ngcontent-ng-c995348536 class='slo-font-style'>" + premiumText + "</span></div>";
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
				
					backgroundColor = "#ffffff";
					if(premium * 1000 > strike) {
						backgroundColor = "#cde1c9";
					}
					selectedRow.children[5].getElementsByTagName("a")[0].style.backgroundColor = backgroundColor;
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
			let totGLPct = row.querySelector("[col-id='totGLPct']").innerText;
			let fifTwo = row.querySelector("[col-id='fifTwo']");
			
			curVal = Number(curVal.replace("$", ""));
			qty = Number(qty);
			let {dte, tradingDTE} = getDTEsAndPremium(optionDates[i], "");
	
			let remainingPPD = calculatePPD((curVal / qty) / 100, tradingDTE);
			
			totGLPct = Number(totGLPct.replace("+", "").replace("%", ""));
			
			let backgroundColor = "#ffffff";
			//if(totGLPct >= 50) {
			if(remainingPPD * 15 < optionStrikes[i]) {
				backgroundColor = "#cde1c9";
			}
			
			fifTwo.getElementsByClassName("posweb-cell-fifty_two_week_range_container")[0].innerText = "$" + remainingPPD + "/day";
			fifTwo.style.backgroundColor = backgroundColor;
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
		
		//tradingDTE -= (((new Date()).getHours() - 8) / 7);
		
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
