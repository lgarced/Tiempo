var searchedCities = document.querySelector(".recent-search");

//get data from apis
let weather = {
  apiKey: "4253ae682bded8fe54667e18d996e279",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          //alert("No weather found.") need to fix this to display user the error;
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.city = data[0].name;
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&units=imperial&lang=en&appid=${weather.apiKey}`
        )
          .then((res) => res.json())
          .then((data) => {
            this.displayWeather(data.current);
            this.fiveDays(data.daily);
            // this.currentHour(data.hourly);
            this.saveToStorage(this.city);
            renderPastSearches();
          });
      });
  }, //transform data into html
  displayWeather: function (data) {
    const { icon, description, main } = data.weather[0];
    const { dt, temp, humidity, wind_speed } = data;
    const date = new Date(dt);
    document.querySelector(".city").innerText = "Weather in " + this.city;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°F";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind Speed: " + wind_speed + " m/h";
    // document.querySelector(".current-hour").innerText =
    //   "The time in " + this.city + "is" + date;
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + this.city + "')";
  },

  //search bar function
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

  // functions is not working
  // currentHour: function (data) {
  //   const dt = data[0];
  //   let tiempo = (dt * 1000)
  //   console.log(data);
  //   //dt = (dt * 100);
  //   document.querySelector(".current-hour").innerHTML =
  //     "The time in " + this.city + " is " + tiempo;
  // },

  // five days display boxes forecast
  fiveDays: function (data) {
    let fiveDays = document.querySelector("#five-days");
    fiveDays.innerHTML = "";
    for (i = 1; i < 6; i++) {
      const { dt } = data[i];
      let dayContainerEl = document.createElement("div");
      dayContainerEl.setAttribute("class", "col-2");
      let dateEl = document.createElement("h4");
      dateEl.textContent = new Date(dt * 1000);
      dateEl.textContent = dateEl.textContent.slice(0, 11);
      dateEl.setAttribute("class", "day")
      let imageEl = document.createElement("img");
      imageEl.setAttribute(
        "src",
        `http://openweathermap.org/img/w/${data[i].weather[0].icon}.png`
      );
      let tempEl = document.createElement("h4");
      tempEl.textContent = "Temp: " + data[i].temp.day + "°F";
      let windEl = document.createElement("h4");
      windEl.textContent = "Wind: " + data[i].wind_speed + "mph";
      let humidityEl = document.createElement("h4");
      humidityEl.textContent = "Humidity: " + data[i].humidity + "%";
      let uviEl = document.createElement("h4");
      uviEl.textContent = "UV Index: " + data[i].uvi + "%";
      fiveDays.append(dayContainerEl);
      dayContainerEl.append(dateEl, tempEl, windEl, humidityEl, imageEl, uviEl);
    }
  },

  saveToStorage: function (pastCity) {
    let storedCities = JSON.parse(localStorage.getItem("pastCities")) || [];
    if (storedCities.includes(pastCity)) return;
    storedCities.push(pastCity);
    localStorage.setItem("pastCities", JSON.stringify(storedCities));
  },

  deleteFromStorage: function (cities) {
    console.log(cities)
    let deleteCities = JSON.parse(localStorage.getItem("pastCities"));
    deleteCities.splice(deleteCities.indexOf(cities), 1);
    //save updated array to localstorage
    localStorage.setItem("pastCities", JSON.stringify(deleteCities));
    renderPastSearches();
  },
    
};

function renderPastSearches() {
  searchedCities.innerHTML = "";
  searchedCities.setAttribute("class", "recent");
  // let deleteButton = document.createElement("button")
  // deleteButton.textContent = "DELETE"
  let storedCities = JSON.parse(localStorage.getItem("pastCities")) || [];
  for (let i = 0; i < storedCities.length; i++) {
    const historyItem = document.createElement("button");
    const deleteIcon = document.createElement("i");
    deleteIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`;
    deleteIcon.addEventListener("click", function (e) {
     e.stopPropagation();
     console.log(e)
      weather.deleteFromStorage();
    })
    historyItem.textContent = storedCities[i];
    historyItem.addEventListener("click", function () {
      weather.fetchWeather(storedCities[i]);
    });
    historyItem.append(deleteIcon);
    searchedCities.append(historyItem);
  }
}
renderPastSearches();

  // I would like to display a map afterthe five days divs

// let maps = {
//       apiKey: "4253ae682bded8fe54667e18d996e279",
//    fetchMaps: function (maps) {

//     fetch(`https://tile.openweathermap.org/map/layer=precipitation_new{z}/{x}/{y}.png?appid=${weather.apiKey}`)
//     .then((mapas) => {
//         console.log(mapas)
//       return mapas.json
//     })
//   },

//   displayMap: function(mapas) {
//     let mapsdisplay = document.createElement("map")
//     mapsdisplay.
//   }
//   };

//search bar fnction
document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});
