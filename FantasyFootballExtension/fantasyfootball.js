chrome.storage.local.get("props", function (item) {
  let ppdDiv;
  setInterval(() => {
    if (item?.props?.checked === false) {
      return;
    }
	
	let numberOfTeams = 5;
	
	//console.log("hello yahoo");
	
	let tableInteractive = document.getElementsByClassName("Table-interactive")[0];
	
	if(!tableInteractive) {
		return;
	}
	
	let watchList = tableInteractive.getElementsByClassName("F-watch");
	let fanPts = tableInteractive.getElementsByClassName("Fw-b");
	
	if(watchList.length != fanPts.length || watchList.length == 0) {
		return;
	}
	
	let playersPts = [];
	for(let i = 0; i < watchList.length; i++) {
		if(watchList[i].title == "Add to Watch List") {
			playersPts.push(Number(fanPts[i].innerText));
		}
		if(playersPts.length == numberOfTeams) {
			break;
		}
	}
	
	if(playersPts.length == numberOfTeams) {
		let average = playersPts.reduce((total, num) => total + num) / playersPts.length;
		console.log(average);
		console.log(playersPts);
		let percentage = "<span style='font-size: 20px;'>Score - " + (playersPts[0] - average).toFixed(0) + "</span>";
		document.getElementsByClassName("Checkbox-text")[0].innerHTML = percentage;
	} else {
		document.getElementsByClassName("Checkbox-text")[0].innerHTML = "Show my team";
	}
  }, 1000);
});
