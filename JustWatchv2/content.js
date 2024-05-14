chrome.storage.local.get("props", function (item) {
	let busy = false;
	let movieData = item?.props?.movieData ?? {};
	setInterval(() => {
		if(busy === false) {
			busy = true;
			
			// First, update the movie data
			
			let elements = document.getElementsByClassName("title-list-grid__item--link");
			
			if(elements.length === 0) {
				// exit early if we didn't find a movie grid
				return;
			}
			
			for(let i = 0; i < elements.length; i++) {
				if(movieData[elements[i].pathname] === undefined) {
					movieData[elements[i].pathname] = {
						element: elements[i],
						rating: -1,
						count: -1,
						foreign: false
					};
				} else {
					movieData[elements[i].pathname].element = elements[i];
				}
			}
			
			// Second, hide all foreign and low rated movies
			
			let movieDataKeys = Object.keys(movieData);
			for(let i = 0; i < movieDataKeys.length; i++) {
				let key = movieDataKeys[i];
				
				// hide if it is a foreign movie or has less than 100,000 reviews
				let shouldHide = movieData[key].foreign || (movieData[key].count >=0 && movieData[key].count < 100000);
				
				if(shouldHide && movieData[key].element?.parentElement && movieData[key].element?.parentElement?.style?.display !== "none") {
					movieData[key].element.parentElement.style.display = "none";
				}
			}
			
			// Third, find the first movie that is missing rating and foreign data
			
			let movieRequest;
			for(let i = 0; i < elements.length; i++) {
				if(movieData[elements[i].pathname].count < 0) {
					movieRequest = movieData[elements[i].pathname];
					break;
				}
			}
			
			// Fourth, request and populate the missing movie data
			
			if(movieRequest) {
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function () {
					if(this.readyState == 4) {
						if(this.status == 200) {
							movieRequest.foreign = this.responseText.indexOf("Original Title:") >= 0;
							
							let substr = this.responseText.substring(this.responseText.indexOf('alt="IMDB"'));
							substr = substr.substring(substr.indexOf("<span>") + 6);
							substr = substr.substring(0, substr.indexOf("</span>") - 1);
							
							let parts = substr.trim().replace("   ", " ").replace("  ", " ").split(" ");
							let rating = parts[0] ?? "0";
							let count = parts[1] ?? "(0)";
							count = count.substring(1, count.length - 1);
							count = count
							  .replace("k", "000")
							  .replace("m", "000000")
							  .replace("b", "000000000");
							  
							rating = isNaN(rating) ? 0 : Number(rating);
							count = isNaN(count) ? 0 : Number(count);
							
							movieRequest.rating = rating;
							movieRequest.count = count;
							
							try {
								chrome?.storage?.local?.set({
									props: {
										movieData: movieData
									},
								});
							} catch(e) {
								console.log("Error while storing movie data", e);
							}
						}
						busy = false;
					}
				};
				xhttp.open("GET", movieRequest.element.href, true);
				xhttp.send();
			} else {
				busy = false;
			}
		}
	}, 4000);
});
