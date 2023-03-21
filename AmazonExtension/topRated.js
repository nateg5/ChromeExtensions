chrome.storage.local.get('props', function(item) {
    checked = item.props.checked;
    showNumber = Number(item.props.showNumber);
    let bestSellers = true;
    items = document.getElementsByClassName('a-column a-span12 a-text-center _cDEzb_grid-column_2hIsc');
    if(items.length === 0) {
        bestSellers = false;
        items = document.getElementsByClassName('sg-col-4-of-12 sg-col-4-of-16 sg-col-4-of-20 sg-col-4-of-24');
    }
    if(items.length === 0) {
        items = document.getElementsByClassName('_octopus-search-result-card_style_apbSearchResultItem__2-mx4');
    }
	console.log("item", items);
    let counts = [];
    for(let i = 0; i < items.length; i++) {
        let count = 1;
        let countArray = items[i].getElementsByClassName('a-size-small');
        if(!bestSellers) {
            countArray = items[i].getElementsByClassName('a-size-base s-underline-text');
        }
        let j = 0;
        if(countArray.length > 0) {
            count = undefined;
            for(j = 0; j < countArray.length && isNaN(count); j++) {
                count = countArray[j].innerHTML;
                count = parseInt(count.replace(",", "").replace("(", "").replace(")", ""));
            }
        }
        if(isNaN(count)) {
            count = 1;
        }
        if(countArray[j - 1] && countArray[j - 1].innerHTML) {
            counts.push(count);
        }
    }
    counts.sort(function(a, b) {
        return a - b;
    });
    console.log("counts", counts);
    let weight = Math.ceil(counts[Math.ceil(counts.length / 2)] / 10);
    console.log("weight = " + weight);
    itemsArray = [];
    for(let i = 0; i < items.length; i++) {
        let rating = 1;
        let ratingArray = items[i].getElementsByClassName('a-icon-alt');
        if(ratingArray.length > 0) {
            rating = undefined;
            for(let j = 0; j < ratingArray.length && isNaN(rating); j++) {
                rating = ratingArray[j].innerHTML.substring(0, 3);
                rating = parseFloat(rating.replace(",", ""));
            }
        }
        let count = 1;
        let countArray = items[i].getElementsByClassName('a-size-small');
        if(!bestSellers) {
            countArray = items[i].getElementsByClassName('a-size-base s-underline-text');
        }
        let j = 0;
        if(countArray.length > 0) {
            count = undefined;
            for(j = 0; j < countArray.length && isNaN(count); j++) {
                count = countArray[j].innerHTML;
                count = parseInt(count.replace(",", "").replace("(", "").replace(")", ""));
            }
        }
        if(isNaN(rating) || isNaN(count)) {
            rating = 1;
            count = 1;
        }
        if(countArray[j - 1] && countArray[j - 1].innerHTML) {
            itemsArray.push({
                item: items[i],
                countItem: countArray[j - 1],
                rating: (rating * count) / (count + weight)
            });
        }
    }
    itemsArray.sort(function(a, b) {
        return b.rating - a.rating;
    });
    console.log("itemsArray", itemsArray);
    colorArray = ["#00ff00", "#10ff10", "#20ff20", "#30ff30", "#40ff40", "#50ff50", "#60ff60", "#70ff70", "#80ff80", "#90ff90", "#a0ffa0", "#b0ffb0", "#c0ffc0", "#d0ffd0", "#e0ffe0", "#f0fff0"];
    for(let i = 0; i < itemsArray.length; i++) {
        itemsArray[i].item.style.backgroundColor = "#ffffff";
        itemsArray[i].item.children[0].style.backgroundColor = "#ffffff";
        itemsArray[i].item.style.display = 'block';
        if(itemsArray[i].countItem.innerHTML.lastIndexOf(" - #") >= 0) {
            itemsArray[i].countItem.innerHTML = itemsArray[i].countItem.innerHTML.substring(0, itemsArray[i].countItem.innerHTML.lastIndexOf(" - #"));
        }
        if(checked) {
            if(i < showNumber) {
                itemsArray[i].item.style.backgroundColor = colorArray[i];
                itemsArray[i].item.children[0].style.backgroundColor = colorArray[i];
                itemsArray[i].countItem.innerHTML += " - #" + (i + 1) + " - " + itemsArray[i].rating.toFixed(2);
            } else {
                itemsArray[i].item.style.display = 'none';
            }
        }
    }
});
