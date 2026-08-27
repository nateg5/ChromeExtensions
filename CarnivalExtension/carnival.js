chrome.storage.local.get("props", function (item) {
  let greenHighlight = "#cde1c9";
  let redHighlight = "#ffc0c0";
  let orangeHighlight = "#ffe0c0";
  setInterval(() => {
    if (item?.props?.checked === false) {
      return;
    }
	
	let results = [];
	
	let cruises = Array.from(document.querySelector('[data-testid="tripTilesContainer"]').children).filter((child) => {
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
		window.scrollTo({
		  top: 0,
		  behavior: 'smooth'
		});
	}
	
	document.querySelector('[data-testid="loadMoreResults"]')?.click();
  }, 1000);
});
