checkboxes = document.getElementsByClassName('checklist-item');
for(let i = 0, delay = 1000; i < checkboxes.length; i++) {
	let checkbox = checkboxes[i].getElementsByClassName('checklist-item-checkbox-check');
	if(checkboxes[i].className.indexOf('checklist-item-state-complete') < 0) {
		setTimeout(function() {
			checkbox[0].click();
		}, delay);
		delay += 1000;
	}
}