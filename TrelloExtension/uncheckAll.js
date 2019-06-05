checkboxes = document.getElementsByClassName('checklist-item-state-complete');
for(let i = 0, delay = 1000; i < checkboxes.length; i++) {
	let checkbox = checkboxes[i].getElementsByClassName('checklist-item-checkbox-check');
    setTimeout(function() {
        checkbox[0].click();
    }, delay);
	delay += 1000;
}