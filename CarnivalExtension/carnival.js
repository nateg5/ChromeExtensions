chrome.storage.local.get("props", function (item) {
  let greenHighlight = "#cde1c9";
  let redHighlight = "#ffc0c0";
  let orangeHighlight = "#ffe0c0";
  setInterval(() => {
    if (item?.props?.checked === false) {
      return;
    }
	
	let results = [];
	
	let cruises = document.getElementsByClassName("sc-bvrlno jPHeTw");
	
	for(let i = 0; i < cruises.length; i++) {
		if(cruises[i].getElementsByClassName("sc-hOynoF koJuKT").length == 0) {
			break;
		}
		
		let price = Number(cruises[i].getElementsByClassName("sc-hOynoF koJuKT")[0].innerText.replace(",", ""));
		let days = Number(cruises[i].getElementsByClassName("sc-ecPEgm jbicOR")[0].innerText.split("-")[0]);
		let ppd = Math.floor(price / days);
		
		if(cruises[i].getElementsByClassName("ppd").length == 0) {
			let div = document.createElement("div");
			div.classList.add("ppd");
			cruises[i].getElementsByClassName("sc-cdoIaK kaetwo")[0].prepend(div);
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
	
	let container = document.getElementsByClassName("sc-bzBgWG DnlNf")[0];
	
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
	
	document.getElementsByClassName("sc-dLMFU sc-ikkxIA dhoQiW cvAoBL cclr-cmp-btn-primary-white")[0]?.click();
  }, 1000);
});
