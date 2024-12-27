chrome.storage.local.get("props", function (item) {
  let sortProducts = (
    topLevelClass,
    itemClass,
    countClassLevel1,
    countClassLevel2
  ) => {
    for (
      let topLevelIndex = 0;
      topLevelIndex < document.getElementsByClassName(topLevelClass).length;
      topLevelIndex++
    ) {
      let ratingElements = Array.from(
        document
          .getElementsByClassName(topLevelClass)
          [topLevelIndex].getElementsByClassName("a-icon-alt")
      );
	  
	  console.log("ratingElements", ratingElements);

      let itemElements = [];
      for (let i = 0; i < ratingElements.length; i++) {
        let itemElement = ratingElements[i];
        while (itemElement.className.search(itemClass) < 0) {
          itemElement = itemElement.parentElement;
        }
        itemElements.push(itemElement);
      }
	  
	  console.log("itemElements", itemElements);

      let countElements = [];
      for (let i = 0; i < itemElements.length; i++) {
        let countElement =
          itemElements[i].getElementsByClassName(countClassLevel1)[0];
        if (countElement && countClassLevel2) {
          countElement =
            countElement.getElementsByClassName(countClassLevel2)[0];
        }
        countElements.push(countElement);
      }
	  
	  console.log("countElements", countElements);

      for (let i = itemElements.length - 1; i >= 0; i--) {
        if (!countElements[i]) {
          itemElements.splice(i, 1);
          ratingElements.splice(i, 1);
          countElements.splice(i, 1);
        }
      }

      let ratings = [];
      for (let i = 0; i < ratingElements.length; i++) {
        ratings.push(Number(ratingElements[i].innerHTML.split(" ")[0]));
      }
	  
	  console.log("ratings", ratings);

      let counts = [];
	  let stringToInt = (strCount) => {
		  let tempCount = strCount
              .trim()
              .split(" ")[0]
              .replace(",", "")
              .replace("(", "")
              .replace(")", "");
		  let periodIndex = tempCount.indexOf(".");
		  let kIndex = tempCount.indexOf("K");
		  if(periodIndex >= 0 && kIndex >= 0) {
			  let zerosToAdd = 4 - (kIndex - periodIndex);
			  tempCount = tempCount.replace(".", "").replace("K", "");
			  for(let i = 0; i < zerosToAdd; i++) {
				  tempCount += "0";
			  }
		  }
		  return tempCount;
	  };
      for (let i = 0; i < countElements.length; i++) {
        counts.push(
          Number(
            stringToInt(countElements[i].innerHTML)
          )
        );
      }
	  
	  console.log("counts", counts);

      let countsSorted = counts.slice().sort((a, b) => a - b);

      let weight = Math.floor(
        countsSorted[Math.floor(countsSorted.length / 2)] / 10
      );

      let items = [];
      for (let i = 0; i < itemElements.length; i++) {
        items.push({
          itemElement: itemElements[i],
          ratingElement: ratingElements[i],
          countElement: countElements[i],
          rating: ratings[i],
          count: counts[i],
          weightedRating: (ratings[i] * counts[i]) / (counts[i] + weight),
        });
      }
      items.sort((a, b) => b.weightedRating - a.weightedRating);

      for (let i = 0; i < items.length; i++) {
        items[i].rank = i + 1;
        let customHTML =
          items[i].count +
          " - #" +
          items[i].rank +
          " - " +
          items[i].weightedRating.toFixed(2);
        if (items[i].countElement.innerHTML != customHTML) {
          items[i].countElement.innerHTML = customHTML;
        }
      }

      let update = false;
      for (let i = 0; i < itemElements.length; i++) {
        if (itemElements[i] != items[i].itemElement) {
          update = true;
          break;
        }
      }

      if (update) {
        items.reverse();

        for (let i = 0; i < items.length; i++) {
          document
            .getElementsByClassName(topLevelClass)
            [topLevelIndex].insertBefore(
              items[i].itemElement,
              document.getElementsByClassName(topLevelClass)[topLevelIndex]
                .firstChild
            );
        }


        items.reverse();

        console.log("items", items);
      }
    }
  };
  setInterval(() => {
    if (!item.props.checked) {
      return;
    }

    let topLevelClass = "p13n-gridRow";
    let itemClass = "a-column";
    let countClassLevel1 = "a-size-small";
    let countClassLevel2 = null;

    sortProducts(topLevelClass, itemClass, countClassLevel1, countClassLevel2);

    topLevelClass = "s-result-list";
    itemClass = /s-(inner-)?result-item/;
    countClassLevel1 = "a-size-base s-underline-text";

    sortProducts(topLevelClass, itemClass, countClassLevel1, countClassLevel2);
	
	topLevelClass = "s-result-list";
    itemClass = /s-(inner-)?result-item/;
    countClassLevel1 = "a-size-small s-underline-text";

    sortProducts(topLevelClass, itemClass, countClassLevel1, countClassLevel2);

    topLevelClass =
      "_octopus-search-result-card_style_apbSearchResultsContainer__bCqjb";
    itemClass = "_octopus-search-result-card_style_apbSearchResultItem__2-mx4";
    countClassLevel1 = "a-size-base s-underline-text";

    sortProducts(topLevelClass, itemClass, countClassLevel1, countClassLevel2);

    topLevelClass = "octopus-pc-card-list";
    itemClass = "octopus-pc-item ";
    countClassLevel1 = "octopus-pc-asin-review-star";
    countClassLevel2 = "a-size-mini a-color-tertiary";

    sortProducts(topLevelClass, itemClass, countClassLevel1, countClassLevel2);

    countClassLevel1 = "octopus-pc-dotd-review-star";

    sortProducts(topLevelClass, itemClass, countClassLevel1, countClassLevel2);

    topLevelClass = "a-carousel";
    itemClass = "a-carousel-card";
    countClassLevel1 = "a-icon-row";
    countClassLevel2 = "a-size-small a-color-secondary";

    sortProducts(topLevelClass, itemClass, countClassLevel1, countClassLevel2);

    countClassLevel2 = "a-size-small";

    sortProducts(topLevelClass, itemClass, countClassLevel1, countClassLevel2);
  }, 1000);
});
