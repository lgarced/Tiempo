var searchedCities = document.querySelector(".recent-search");

//get data from apis
let weather = {
  apiKey: "4253ae682bded8fe54667e18d996e279",
  fetchWeather: function (city) {
    fetch(
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
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
        console.log(this.city);
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&units=imperial&lang=en&appid=${weather.apiKey}`
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            this.displayWeather(data.current);
            this.fiveDays(data.daily);
            console.log(data.daily);
            this.currentHour(data.hourly);
            this.saveToStorage(this.city);
            renderPastSearches();
          });
      });
  }, //transform data into html
  displayWeather: function (data) {
    const { icon, description } = data.weather[0];
    const { dt, temp, humidity, wind_speed } = data;
    const date = new Date(dt);
    console.log(date.getTime());
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
  //functions is not working
  // currentHour: function (data) {
  //   const dt = data[0];
  //   let tiempo = (dt * 1000)
  //   console.log(data);
  //   //dt = (dt * 100);
  //   document.querySelector(".current-hour").innerHTML =
  //     "The time in " + this.city + " is " + tiempo;
  // },
  //five days display boxes forecast
  fiveDays: function (data) {
    let fiveDays = document.querySelector("#five-days");
    fiveDays.innerHTML = "";
    for (i = 1; i < 6; i++) {
      const { dt } = data[i];
      
      console.log([i]);
      let dayContainerEl = document.createElement("div");
      dayContainerEl.setAttribute("class", "col-2");
      let dateEl = document.createElement("h4");
      dateEl.textContent = new Date(dt * 1000);
      dateEl.textContent = dateEl.textContent.slice(0,11)
      console.log(new Date(dt * 1000));
      let imageEl = document.createElement("img");
      imageEl.setAttribute(
        "src",
        `http://openweathermap.org/img/w/${data[i].weather[0].icon}.png`
      );
      let tempEl = document.createElement("h4");
      tempEl.textContent = "Temp: " + data[i].temp.day + "°F";
      let windEl = document.createElement("h4");
      windEl.textContent = "Wind: " + data[i].wind_speed;
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
};

function renderPastSearches() {
  searchedCities.innerHTML = "";
  searchedCities.setAttribute("class", "recent");
  let storedCities = JSON.parse(localStorage.getItem("pastCities")) || [];
  for (let i = 0; i < storedCities.length; i++) {
    const historyItem = document.createElement("button");
    historyItem.textContent = storedCities[i];
    historyItem.addEventListener("click", function () {
      weather.fetchWeather(storedCities[i]);
    });
    searchedCities.append(historyItem);
  }
}
renderPastSearches();
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
