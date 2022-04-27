let pastSearches =
  JSON.parse(window.localStorage.getItem("pastSearches")) || [];

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
          //alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.city = data[0].name;
        console.log(this.city);
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&units=imperial&lang=en&appid=${weather.apiKey}`
        )
          .then((res) => res.json())
          .then((data) => {
            this.displayWeather(data.current);
            this.fiveDays(data.daily);
            console.log(data);
            this.currentHour(data.hourly);
          });
      });
  }, //transform data into html
  displayWeather: function (data) {
    const { icon, description } = data.weather[0];
    const { dt, temp, humidity, wind_speed } = data;
    const hour = dt * 1000;
    document.querySelector(".city").innerText = "Weather in " + this.city;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°F";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind Speed: " + wind_speed + " m/h";
    document.querySelector(".current-hour").innerText =
      "The time in " + this.city + "is" + hour;
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + this.city + "')";
  },

  //search bar function
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
  currentHour: function (data) {
    const dt = data[dt];
    console.log(data);
    dt = dt * 100;
    document.querySelector(".current-hour").innerHTML =
      "The time in " + this.city + " is " + dt;
  },
  //five days display boxes
  fiveDays: function (data) {
    let fiveDays = document.querySelector(".five-days");

    for (i = 0; i < 5; i++) {
      console.log([i]);
      let dayContainerEl = document.createElement("div");
      let dateEl = document.createElement("h4");
      dateEl.textContent = data[i];
      dayContainerEl.append(dateEl);
      let imageEl = document.createElement("img");
      imageEl.setAttribute(
        "src",
        `http://openweathermap.org/img/w/${data[i].weather[0].icon}.png`
      );
      dayContainerEl.append(imageEl);
      let tempEl = document.createElement("h4");
      tempEl.textContent = data[i].temp;
      dayContainerEl.append(tempEl);
      let windEl = document.createElement("h4");
      windEl.textContent = data[i].weather.wind_speed;
      dayContainerEl.append(windEl);
      let humidityEl = document.createElement("h4");
      humidityEl.textContent = data[i].humidity;
      dayContainerEl.append(humidityEl);
      fiveDays.append(dayContainerEl);
    }
  },
};

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
