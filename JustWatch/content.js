chrome.storage.local.get("props", function (item) {
  let createFilters = () => {
    let select = "<select id='filterSelect'>";
    select += "<option value='0'>Show All</option>";
    select += "<option value='10000'>10000</option>";
    select += "<option value='100000'>100000</option>";
    select += "<option value='toprated'>Top Rated</option>";
    select += "</select>";

    let ageSelect = "<select id='ageSelect'>";
    ageSelect += "<option value='all'>Show All</option>";
    ageSelect += "<option value='R'>Hide R</option>";
    ageSelect += "<option value='R,'>Hide R and Unrated</option>";
    ageSelect += "</select>";

    let foreignSelect = "<select id='foreignSelect'>";
    foreignSelect += "<option value='all'>Show All</option>";
    foreignSelect += "<option value='foreign'>Hide Foreign</option>";
    foreignSelect += "</select>";

    let leavingSelect = "<select id='leavingSelect'>";
    leavingSelect += "<option value='all'>Show All</option>";
    leavingSelect += "<option value='staying'>Show Leaving Soon</option>";
    leavingSelect += "</select>";

    let filterDiv = document.createElement("div");
    filterDiv.innerHTML = select + ageSelect + foreignSelect + leavingSelect;

    if (document.getElementsByClassName("row-filter-bar").length > 0) {
      document
        .getElementsByClassName("row-filter-bar")[0]
        .appendChild(filterDiv);

      document.getElementById("filterSelect").addEventListener("click", () => {
        filterChange();
      });
      document.getElementById("ageSelect").addEventListener("click", () => {
        ageChange();
      });
      document.getElementById("foreignSelect").addEventListener("click", () => {
        foreignChange();
      });
      document.getElementById("leavingSelect").addEventListener("click", () => {
        leavingChange();
      });
    }
  };

  let filterChange = () => {
    filterValue = document.getElementById("filterSelect").value;
  };

  let ageChange = () => {
    ageValue = document.getElementById("ageSelect").value.split(",");
  };

  let foreignChange = () => {
    foreignValue = document.getElementById("foreignSelect").value.split(",");
  };

  let leavingChange = () => {
    leavingValue = document.getElementById("leavingSelect").value.split(",");
  };

  setInterval(() => {
    if (
      !document.getElementById("filterSelect") ||
      !document.getElementById("ageSelect") ||
      !document.getElementById("foreignSelect") ||
      !document.getElementById("leavingSelect")
    ) {
      createFilters();
    }
  }, 1000);

  let busy = false;
  let movieData = {};
  let movieQueue = [];
  let filterValue = "0";
  let ageValue = ["all"];
  let foreignValue = "all";
  let leavingValue = "all";
  let hideMovie = (movie) => {
    if (isNaN(filterValue)) {
      if (filterValue == "toprated") {
        let weightedRating =
          (movie.count * movie.rating) / (movie.count + 10000);
        if (
          weightedRating < (100000 * 7) / 110000 ||
          movie.foreign == foreignValue ||
          movie.leaving == leavingValue ||
          ageValue.indexOf(movie.age) >= 0
        ) {
          if (movie.element.parentElement.style.display != "none") {
            movie.element.parentElement.style.display = "none";
          }
        } else {
          if (movie.element.parentElement.style.display != "block") {
            movie.element.parentElement.style.display = "block";
          }
        }
      }
    } else {
      filterValue = Number(filterValue);
      if (
        movie.count < filterValue ||
        movie.foreign == foreignValue ||
        movie.leaving == leavingValue ||
        ageValue.indexOf(movie.age) >= 0
      ) {
        if (movie.element.parentElement.style.display != "none") {
          movie.element.parentElement.style.display = "none";
        }
      } else {
        if (movie.element.parentElement.style.display != "block") {
          movie.element.parentElement.style.display = "block";
        }
      }
    }
  };
  setInterval(() => {
    if (!busy && movieQueue.length == 0) {
      busy = true;
      try {
        let elements = document.getElementsByClassName(
          "title-list-grid__item--link"
        );
        for (let i = 0; i < elements.length; i++) {
          if (Object.keys(movieData).indexOf(elements[i].href) < 0) {
            movieData[elements[i].href] = {};
          }
          movieData[elements[i].href].element = elements[i];
          hideMovie(movieData[elements[i].href]);
        }
        for (let key in movieData) {
          if (
            movieData[key].rating == undefined ||
            movieData[key].count == undefined ||
            movieData[key].foreign == undefined ||
            movieData[key].leaving == undefined ||
            movieData[key].age == undefined
          ) {
            movieQueue.push(movieData[key]);
            if (movieQueue.length >= 3) {
              break;
            }
          }
        }
      } catch (e) {
        console.log("********** ERROR **********", e);
      } finally {
        busy = false;
      }
    }
  }, 1000);
  setInterval(() => {
    if (!busy && movieQueue.length > 0) {
      busy = true;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          try {
            if (this.status == 200) {
              // is it in another language
              let foreign = this.responseText.indexOf("Original Title:") >= 0 ? "foreign" : "";
              movieQueue[0].foreign = foreign;

              // is it in leaving soon
              let leaving = this.responseText.indexOf("Leaving in ") >= 0 ? "leaving" : "staying";
              movieQueue[0].leaving = leaving;

              // get imdb rating and count
              if (
                this.responseText.indexOf('alt="IMDB"') < 0 &&
                this.responseText.indexOf('alt="JustWatch Rating"') < 0
              ) {
                console.log(
                  "********** Could not find IMDB rating for",
                  movieQueue[0].element.href
                );
              } else {
                let substr = this.responseText.substring(
                  this.responseText.indexOf('alt="IMDB"')
                );
                substr = substr.substring(substr.indexOf(">") + 2);
                substr = substr.substring(0, substr.indexOf("</a>") - 1);
                let parts = substr.split(" ");
                let rating = parts[0] ?? "0";
                let count = parts[1] ?? "0";
                count = count.substring(1, count.length - 1);
                count = count
                  .replace("k", "000")
                  .replace("m", "000000")
                  .replace("b", "000000000");
                rating = isNaN(rating) ? 0 : Number(rating);
                count = isNaN(count) ? 0 : Number(count);
                movieQueue[0].rating = rating;
                movieQueue[0].count = count;
              }

              // get age rating
              if (this.responseText.indexOf("Age rating") < 0) {
                console.log(
                  "********** Could not find Age rating for",
                  movieQueue[0].element.href
                );
              } else {
                let substr = this.responseText.substring(
                  this.responseText.indexOf("Age rating")
                );
                substr = substr.substring(
                  substr.indexOf("detail-infos__value")
                );
                substr = substr.substring(substr.indexOf(">") + 1);
                substr = substr.substring(0, substr.indexOf("</div>"));
                movieQueue[0].age = substr;
              }

              hideMovie(movieQueue[0]);
              movieQueue.splice(0, 1);
            } else {
              console.log(
                "********** Received non 200 status for",
                movieQueue[0].element.href,
                this.status
              );
            }
          } catch (e) {
            console.log("********** ERROR **********", e);
          } finally {
            busy = false;
          }
        }
      };
      xhttp.open("GET", movieQueue[0].element.href, true);
      xhttp.send();
    }
  }, 1000);
});
