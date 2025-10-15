chrome.storage.local.get("props", function (item) {
  let ppdDiv;
  setInterval(() => {
    if (item?.props?.checked === false) {
      return;
    }
	
	console.log("nba");
	
	let gameDivs = document.getElementsByClassName("ScheduleGame_sg__RmD9I");
	
	for(let i = 0; i < gameDivs.length; i++) {
		if(
			gameDivs[i].innerHTML.indexOf("<p class=\"Broadcasters_title__B1dGd\">TV</p>") < 0 &&
			gameDivs[i].innerHTML.indexOf("nbc.svg") < 0 &&
			gameDivs[i].innerHTML.indexOf("prime-video.svg") < 0 &&
			gameDivs[i].innerHTML.indexOf("abc.svg") < 0
			) {
			gameDivs[i].style.display = "none";
		}
	}
  }, 1000);
});
