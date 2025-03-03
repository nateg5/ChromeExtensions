chrome.storage.local.get("props", function (item) {
  console.log("checked", item?.props?.checked);
  console.log("tripadvisor extension");
  
  let realRatingInterval = setInterval(() => {
	  
	  if(document.getElementsByClassName("realRating").length > 0) {
		  return;
	  }
	  
	  let reviews = document.querySelectorAll('[aria-label="Filter reviews"]')[0].getElementsByClassName("biGQs _P pZUbB osNWb");
	  
	  console.log("reviews", reviews);
	  
	  let reviewsArray = [];
	  
	  for(let i = 0; i < reviews.length; i++) {
		  reviewsArray.push(Number(reviews[i].innerHTML.replace(",", "")));
	  }
	  
	  console.log("reviewsArray", reviewsArray);
	  
	  if(!isNaN(reviewsArray[0])) {
		  
		  let ratingTotal = (reviewsArray[0] * 5) + (reviewsArray[1] * 4) + (reviewsArray[2] * 3) + (reviewsArray[3] * 2) + (reviewsArray[4] * 1);
		  let ratingCount = reviewsArray[0] + reviewsArray[1] + reviewsArray[2] + reviewsArray[3] + reviewsArray[4];
		  
		  let realRating = ratingTotal / ratingCount;
		  
		  console.log("realRating", realRating.toFixed(2));
		  
		  let ratingElement = document.querySelectorAll('[href="#REVIEWS"]')[0].getElementsByClassName("biGQs _P XWJSj Wb")[0].childNodes[0];
		  
		  console.log("ratingElement", ratingElement);
		  
		  ratingElement.innerHTML = "<span class='realRating'>" + realRating.toFixed(2) + "</span>&nbsp;&nbsp;&nbsp;" + ratingElement.innerHTML;
		  
		  //clearInterval(realRatingInterval);
	  }
  }, 1000);
});
