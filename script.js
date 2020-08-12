const APIKey = "f6e6c8da2b2cfc0e39c4d8f5e5177355";
var inputResponse = "";
var iconcode = "";
var uvIndex = "";
var locationInput = "Minneapolis";

// Function to get what's in the local storage
function searchHistoryFunc() {
  if (localStorage.length !== 0) {
    var searchStore = JSON.parse(localStorage.searchHistory);
    for (var i = 0; i < searchStore.length; i++) {
      $("#prev-search").prepend(
        `<button type="submit" class="btn btn-lg btn-block search-items">${searchStore[i].search}</button>`
      );
    }
  }
}

//Getting the UV index
function getUVIndex() {
  var lon = inputResponse.coord.lon;
  var lat = inputResponse.coord.lat;
  var queryUVIndex =
    "http://api.openweathermap.org/data/2.5/uvi?appid=" +
    APIKey +
    "&lat=" +
    lat +
    "&lon=" +
    lon;

  $.ajax({
    url: queryUVIndex,
    method: "GET",
  }).then(function (response) {
    uvIndex = response.value;
    $(".forecastUV-current").text("UV index: " + uvIndex);
  });
}

//Getting the five day forecast
function fiveDay() {
  var cityName = inputResponse.name;
  var queryFiveDay =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    APIKey;
  $.ajax({
    url: queryFiveDay,
    method: "GET",
  }).then(function (response) {
    var forecastList = response.list;
    for (i = 4; i < forecastList.length; i += 8) {
      var displayForecastDate = moment(forecastList[i].dt_txt).format("L");
      var forecastWeatherIcon = forecastList[i].weather[0].icon;
      var forecastIconUrl =
        "http://openweathermap.org/img/w/" + forecastWeatherIcon + ".png";
      var forecastKelvin = forecastList[i].main.temp;
      var forecastTempF = ((forecastKelvin - 273.15) * 1.8 + 32).toFixed(2);

      if (i === 4) {
        $(".forecast-date-day1").text(displayForecastDate);
        $(".forecastIcon-day1").html(
          `<img class="forecastIcon-day1" src=${forecastIconUrl} alt="Weather icon" />`
        );
        $(".forecastTemp-day1").text("Temperature: " + forecastTempF + "F");
        $(".forecastHumidity-day1").text(
          "Humidity: " + forecastList[i].main.humidity + "%"
        );
      } else if (i === 12) {
        $(".forecast-date-day2").text(displayForecastDate);
        $(".forecastIcon-day2").html(
          `<img class="forecastIcon-day1" src=${forecastIconUrl} alt="Weather icon" />`
        );
        $(".forecastTemp-day2").text("Temperature: " + forecastTempF + "F");
        $(".forecastHumidity-day2").text(
          "Humidity: " + forecastList[i].main.humidity + "%"
        );
      } else if (i === 20) {
        $(".forecast-date-day3").text(displayForecastDate);
        $(".forecastIcon-day3").html(
          `<img class="forecastIcon-day1" src=${forecastIconUrl} alt="Weather icon" />`
        );
        $(".forecastTemp-day3").text("Temperature: " + forecastTempF + "F");
        $(".forecastHumidity-day3").text(
          "Humidity: " + forecastList[i].main.humidity + "%"
        );
      } else if (i === 28) {
        $(".forecast-date-day4").text(displayForecastDate);
        $(".forecastIcon-day4").html(
          `<img class="forecastIcon-day1" src=${forecastIconUrl} alt="Weather icon" />`
        );
        $(".forecastTemp-day4").text("Temperature: " + forecastTempF + "F");
        $(".forecastHumidity-day4").text(
          "Humidity: " + forecastList[i].main.humidity + "%"
        );
      } else if (i === 36) {
        $(".forecast-date-day5").text(displayForecastDate);
        $(".forecastIcon-day5").html(
          `<img class="forecastIcon-day1" src=${forecastIconUrl} alt="Weather icon" />`
        );
        $(".forecastTemp-day5").text("Temperature: " + forecastTempF + "F");
        $(".forecastHumidity-day5").text(
          "Humidity: " + forecastList[i].main.humidity + "%"
        );
      }
    }
  });
}

//Getting the current weather
function currentForecast() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    locationInput +
    "&appid=" +
    APIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    inputResponse = response;
    var currentName = response.name;
    var currentKelvin = response.main.temp;
    var currentTempF = ((currentKelvin - 273.15) * 1.8 + 32).toFixed(2);
    var currentHumidity = response.main.humidity;
    var currentWind = response.wind.speed;
    var currentTime = moment().format("L");
    getUVIndex();
    iconcode = response.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    $(".forecastName-current").text(`${currentName} (${currentTime})`);
    $(".forecastIcon-current").html(
      `<img class="forecastIcon-current" src=${iconurl} alt="Weather icon" />`
    );
    $(".forecastTemp-current").text("Temperature: " + currentTempF + "F");
    $(".forecastHumidity-current").text("Humidity: " + currentHumidity + "%");
    $(".forecastWind-current").text("Wind speed: " + currentWind + " MPH");
    fiveDay();
  });
}

$(document).ready(function () {
  searchHistoryFunc();
  currentForecast();

  //The city search
  $(".search-items").on("click", function (e) {
    e.preventDefault();
    var prevSearch = $(this).text();
    locationInput = prevSearch;
    console.log(locationInput);
    currentForecast();
  });
  $("#searchBtn").on("click", function (e) {
    if (locationInput !== null) {
      locationInput = $("#location-input").val();
      e.preventDefault();
      currentForecast();

      //Creating the previous search buttons
      $("#prev-search").prepend(
        `<button class="btn btn-lg btn-block search-items">${locationInput}</button>`
      );
      var searchHistory = {
        search: locationInput,
      };
      var existingSearch = localStorage.getItem("searchHistory") || "[]";
      var existingSearchArr = JSON.parse(existingSearch);
      existingSearchArr.push(searchHistory);
      localStorage.setItem("searchHistory", JSON.stringify(existingSearchArr));
      searchStore = JSON.parse(localStorage.searchHistory);
    }
    $("#location-input").val("");

    //When clicking the previous search buttons
    $(".search-items").on("click", function (e) {
      e.preventDefault();
      var prevSearch = $(this).text();
      locationInput = prevSearch;
      console.log(locationInput);
      currentForecast();
    });
  });

  //Clear button functionality
  $(".clearBtn").on("click", function () {
    localStorage.clear();
    window.location.reload();
  });
});
