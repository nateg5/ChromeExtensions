chrome.storage.local.get("props", function (item) {
  console.log("checked", item?.props?.checked);
  console.log("tripadvisor extension");
  
  let realRatingInterval = setInterval(() => {
	  
	  let items = document.querySelectorAll('[data-automation="WebPresentation_SingleFlexCardSection"]');
	  
	  if(document.getElementsByClassName("realRating").length >= items.length) {
		  return;
	  }
	  
	  let itemArray = [];
	  for(let i = 0; i < items.length; i++) {
		  let rating = Number(items[i].querySelectorAll('[data-automation="bubbleRatingValue"]')[0].innerText);
		  let reviews = Number(items[i].querySelectorAll('[data-automation="bubbleReviewCount"]')[0].innerText.split(" ")[0].replace(",", "").replace("(", "").replace(")", ""));
		  
		  //console.log("", rating, reviews);
		  
		  itemArray.push({
			  item: items[i],
			  rating: rating,
			  reviews: reviews
		  });
	  }
	  
	  itemArray.sort((a, b) => {
		  return b.reviews - a.reviews;
	  });
	  
	  let weight = itemArray[itemArray.length / 2].reviews / 10;
	  
	  for(let i = 0; i < itemArray.length; i++) {
		  let item = itemArray[i];
		  item.weightedRating = (item.rating * item.reviews) / (item.reviews + weight);
		  
		  if(!isNaN(item.reviews) && !isNaN(item.weightedRating)) {
			item.item.querySelectorAll('[data-automation="bubbleReviewCount"]')[0].innerHTML = item.reviews + " - <span class='realRating'>" + item.weightedRating.toFixed(2) + "</span>";
		  }
	  }
	  
	  itemArray.sort((a, b) => {
		  return a.weightedRating - b.weightedRating;
	  });
	  
	  //console.log("", itemArray);
	  
	  for(let i = 0; i < itemArray.length; i++) {
		  let item = itemArray[i];
		  //console.log("item", item);
		  item.item.parentElement.insertBefore(item.item, item.item.parentElement.firstChild);
	  }
  }, 1000);
});
