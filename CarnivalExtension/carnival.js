chrome.storage.local.get("props", function (item) {
  let greenHighlight = "#cde1c9";
  let redHighlight = "#ffc0c0";
  let orangeHighlight = "#ffe0c0";
  setInterval(() => {
    if (item?.props?.checked === false) {
      return;
    }
	
	if(document.getElementsByTagName("body").length > 0 && document.getElementsByClassName("loadingOverlay").length == 0) {
		let div = document.createElement("div");
		div.classList.add("loadingOverlay");
		document.getElementsByTagName("body")[0].prepend(div);
		let loadingOverlay = document.getElementsByClassName("loadingOverlay")[0];
		loadingOverlay.style.display = "none";
		loadingOverlay.style.position = "fixed";
		loadingOverlay.style.width = "100%";
		loadingOverlay.style.height = "100%";
		loadingOverlay.style.justifyContent = "center";
		loadingOverlay.style.zIndex = "9999999";
		loadingOverlay.style.alignItems = "center";
		loadingOverlay.style.backgroundColor = "#00000080";
		loadingOverlay.style.color = "#ffffff";
		loadingOverlay.style.fontSize = "100px";
		loadingOverlay.style.fontWeight = "bold";
		loadingOverlay.style.fontFamily = "arial";
		
		loadingOverlay.innerText = "SORTING...";
	}
	
	let results = [];
	
	let cruises = Array.from(document.querySelector('[data-testid="tripTilesContainer"]')?.children || []).filter((child) => {
		return child.querySelector('[data-testid="priceAmount"');
	});
	
	for(let i = 0; i < cruises.length; i++) {
		let price = Number(cruises[i].querySelector('[data-testid="priceAmount"').innerText.replace(",", ""));
		let days = Number(cruises[i].querySelector('[data-testid="itinerary-title"').innerText.split("-")[0]);
		let ppd = Math.floor(price / days);
		
		if(cruises[i].getElementsByClassName("ppd").length == 0) {
			let div = document.createElement("div");
			div.classList.add("ppd");
			cruises[i].querySelector('[data-testid="pricingContainer"').prepend(div);
		}
		
		let ppdText = "$" + ppd + "/day";
		if(cruises[i].getElementsByClassName("ppd")[0].innerText != ppdText) {
			cruises[i].getElementsByClassName("ppd")[0].innerText = ppdText;
		}
		
		results.push({
			cruise: cruises[i],
			price: price,
			days: days,
			ppd: ppd
		});
	}
	
	results.sort((a, b) => {
		if(b.ppd != a.ppd) {
			return a.ppd - b.ppd;
		} else {
			return a.price - b.price;
		}
	});
	
	let container = document.querySelector('[data-testid="tripTilesContainer"]');
	
	let update = false;
	
	for(let i = 0; i < cruises.length && i < results.length; i++) {
		if(cruises[i] != results[i].cruise) {
			update = true;
			break;
		}
	}
	
	for(let i = results.length - 1; i >= 0 && update; i--) {
		container.prepend(results[i].cruise);
	}
	
	if(update) {
		document.getElementsByClassName("loadingOverlay")[0].style.display = "flex";
		
		window.scrollTo({
		  top: 0,
		  behavior: 'smooth'
		});
	} else {
		document.getElementsByClassName("loadingOverlay")[0].style.display = "none";
	}
	
	document.querySelector('[data-testid="loadMoreResults"]')?.click();
  }, 1000);
});
