chrome.storage.local.get('props', function(item) {
    checked = item.props.checked;
    showNumber = Number(item.props.showNumber);
    items = document.getElementsByClassName('zg-item-immersion');
    if(items.length === 0) {
        items = document.getElementsByClassName('s-result-item');
    }
    let totalCount = 0;
    for(let i = 0; i < items.length; i++) {
        let count = 1;
        let countArray = items[i].getElementsByClassName('a-size-small a-link-normal');
        if(countArray.length === 0) {
            countArray = items[i].getElementsByClassName('a-size-base');
        }
        if(countArray.length > 0) {
            count = undefined;
            for(let j = 0; j < countArray.length && isNaN(count); j++) {
                count = countArray[j].innerHTML;
                count = parseInt(count.replace(",", ""));
            }
        }
        if(isNaN(count)) {
            count = 1;
        }
        totalCount += count;
    }
    let weight = Math.ceil(totalCount / items.length / 10);
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
        let countArray = items[i].getElementsByClassName('a-size-small a-link-normal');
        if(countArray.length === 0) {
            countArray = items[i].getElementsByClassName('a-size-base');
        }
        if(countArray.length > 0) {
            count = undefined;
            for(let j = 0; j < countArray.length && isNaN(count); j++) {
                count = countArray[j].innerHTML;
                count = parseInt(count.replace(",", ""));
            }
        }
        if(isNaN(rating) || isNaN(count)) {
            rating = 1;
            count = 1;
        }
        itemsArray.push({
            item: items[i],
            rating: (rating * count) / (count + weight)
        });
    }
    itemsArray.sort(function(a, b) {
        return b.rating - a.rating;
    });
    colorArray = ["#60ff60", "#70ff70", "#80ff80", "#90ff90", "#a0ffa0", "#b0ffb0", "#c0ffc0", "#d0ffd0", "#e0ffe0", "#f0fff0"];
    for(let i = 0; i < itemsArray.length; i++) {
        if(checked) {
            if(i < showNumber) {
                itemsArray[i].item.style.backgroundColor = colorArray[i];
                itemsArray[i].item.style.height = 'auto';
                itemsArray[i].item.style.visibility = 'visible';
            } else {
                itemsArray[i].item.style.height = '0px';
                itemsArray[i].item.style.visibility = 'hidden';
            } 
        } else {
            itemsArray[i].item.style.backgroundColor = "#ffffff";
            itemsArray[i].item.style.height = 'auto';
            itemsArray[i].item.style.visibility = 'visible';
        }
    }
});