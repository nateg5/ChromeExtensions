checkboxes = document.getElementsByClassName('checklist-item-checkbox-check');
for(let i = 0, delay = 1000; i < checkboxes.length; i++) {
    setTimeout(function() {
        checkboxes[i].click();
    }, delay);
	delay += 1000;
}