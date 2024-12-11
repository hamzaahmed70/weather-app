let cityInput = document.querySelector(".city-input");
let searchBtn = document.querySelector(".search-btn");
let apiKays = "57b9d055dc8e7a131d44a9ffe136088d";
let notFoundSection = document.querySelector(".not-found");
let searchSitySection = document.querySelector(".search-city");
let weatherInfoSection = document.querySelector(".weather-info");
let countryTxt = document.querySelector(".country-txt");
let tempTxt = document.querySelector(".temp-txt");
let conditionTxt = document.querySelector(".condition-txt");
let humidityValueTxt = document.querySelector(".humidity-value-txt");
let windValueTxt = document.querySelector(".wind-value-txt");
let weatherSummaryImg = document.querySelector(".weather-summary-img");
let currentDateTxt = document.querySelector(".current-date-txt");
let forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    upDateWeaterInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    upDateWeaterInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchDate(endPoint, city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKays}&units=metric`;
  let response = await fetch(apiUrl);
  return response.json();
};

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
};

function getCurrentDate() {
  let currentDate = new Date();
  let options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
};

async function upDateWeaterInfo(city) {
  let weatherDate = await getFetchDate("weather", city);
  if (weatherDate.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }
  let {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherDate;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + "℃";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + "M/s";
  weatherSummaryImg.src = `./image/weather/${getWeatherIcon(id)}`;
  currentDateTxt.textContent = getCurrentDate();

  await upDateForecastsInfo(city);
  showDisplaySection(weatherInfoSection);
};

async function upDateForecastsInfo(city) {
  let forecastsDate = await getFetchDate("forecast", city);
  if (!forecastsDate.list) {
    console.error("Forecast data is unavailable");
    return;
  }

  let timeTaken = "12:00:00";
  let todayDate = new Date().toISOString().split("T")[0];
  forecastItemsContainer.innerHTML = "";
  forecastsDate.list.forEach((forCastWeather) => {
    if (
      forCastWeather.dt_txt.includes(timeTaken) &&
      !forCastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forCastWeather);
    }
  });
};
function updateForecastItems(weatherDate) {
  let {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherDate;
  let dateTaken = new Date(date);
  let dateOption = {
    day: "2-digit",
    month: "short",
  };
  let dateResult = dateTaken.toLocaleDateString("en-us", dateOption);
  let forCastItem = `
<div class="forecast-item">
            <h5 class="forecast-item-date regular-txt"> 
${dateResult}
            </h5>
            <img class="forecast-item-img" src="./image/weather/${getWeatherIcon(
              id
            )}" >
            <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
        </div>
`;
  forecastItemsContainer.insertAdjacentHTML("beforeend", forCastItem);
};
function showDisplaySection(section) {
  [weatherInfoSection, searchSitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
};
