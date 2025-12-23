/* ================= CONFIG ================= */
const API_KEY = "e58e0d72df39dfe5f00ac3b7ee07a3f3";

/* ================= DOM ELEMENTS ================= */
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const errorMsg = document.getElementById("errorMsg");

const recentWrapper = document.getElementById("recentWrapper");
const recentCities = document.getElementById("recentCities");

const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const conditionEl = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");
const alertMsg = document.getElementById("alertMsg");
const unitToggle = document.getElementById("unitToggle");
const appBody = document.getElementById("appBody");

/* ================= STATE ================= */
let isCelsius = true;
let currentTempC = null;

/* ================= RECENT SEARCHES ================= */
function loadRecent() {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (cities.length === 0) {
    recentWrapper.classList.add("hidden");
    return;
  }

  recentWrapper.classList.remove("hidden");
  recentCities.innerHTML = `<option value="">Recent Searches</option>`;

  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    recentCities.appendChild(opt);
  });
}

function saveRecent(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (!cities.includes(city)) {
    cities.unshift(city);
    cities = cities.slice(0, 5);
    localStorage.setItem("recentCities", JSON.stringify(cities));
  }

  loadRecent();
}

/* ================= FETCH WEATHER ================= */
async function fetchWeather(url) {
  try {
    hideError();

    const res = await fetch(url);

    if (res.status === 404) {
      throw new Error("City not found. Please check the spelling.");
    }

    if (res.status === 401) {
      throw new Error("Invalid API key. Please try again later.");
    }

    if (!res.ok) {
      throw new Error("Unable to fetch weather data.");
    }

    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    showError(err.message);
  }
}



/* ================= DISPLAY WEATHER ================= */
function displayWeather(data) {
  weatherCard.classList.remove("hidden");

  const city = data.name;
  const tempC = data.main.temp; // already in Celsius
  currentTempC = tempC;

  cityNameEl.textContent = city;
  tempEl.textContent = `${tempC.toFixed(1)} °C`;
  humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
  windEl.textContent = `Wind: ${data.wind.speed} m/s`;
  conditionEl.textContent = `Condition: ${data.weather[0].main}`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  unitToggle.textContent = "Switch to °F";
  isCelsius = true;

  saveRecent(city);
  setBackground(data.weather[0].main);
  checkAlert(tempC);
}

/* ================= UNIT TOGGLE ================= */
unitToggle.addEventListener("click", () => {
  if (currentTempC === null) return;

  if (isCelsius) {
    const f = (currentTempC * 9) / 5 + 32;
    tempEl.textContent = `${f.toFixed(1)} °F`;
    unitToggle.textContent = "Switch to °C";
  } else {
    tempEl.textContent = `${currentTempC.toFixed(1)} °C`;
    unitToggle.textContent = "Switch to °F";
  }

  isCelsius = !isCelsius;
});

/* ================= EXTREME ALERT ================= */
function checkAlert(tempC) {
  if (tempC > 40) {
    alertMsg.textContent = "⚠️ Extreme heat alert!";
    alertMsg.classList.remove("hidden");
  } else {
    alertMsg.classList.add("hidden");
  }
}

/* ================= BACKGROUND ================= */
function setBackground(condition) {
  appBody.classList.remove("sunny", "rainy", "cloudy");

  if (condition === "Rain") {
    appBody.classList.add("rainy");
  } else if (condition === "Clouds") {
    appBody.classList.add("cloudy");
  } else {
    appBody.classList.add("sunny");
  }
}

/* ================= EVENTS ================= */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  hideError();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  fetchWeather(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`
  );

  fetchForecastByCity(city);
});

locationBtn.addEventListener("click", () => {
  hideError();

  if (!navigator.geolocation) {
    showError("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;

      fetchWeather(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );

      fetchForecastByCoords(latitude, longitude);
    },
    () => {
      showError("Location access denied. Please enable location permission.");
    }
  );
});



recentCities.addEventListener("change", () => {
  if (recentCities.value) {
    fetchWeather(
      `https://api.openweathermap.org/data/2.5/weather?q=${recentCities.value}&units=metric&appid=${API_KEY}`
    );

    fetchForecastByCity(recentCities.value);
  }
});

/* ================= 5 DAY FORECAST ================= */
const forecastSection = document.getElementById("forecastSection");
const forecastContainer = document.getElementById("forecastContainer");

/* Fetch 5-day forecast */
async function fetchForecastByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
  await fetchForecast(url);
}

async function fetchForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  await fetchForecast(url);
}


async function fetchForecast(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Forecast data not available");

    const data = await res.json();
    displayForecast(data.list);
  } catch (err) {
    showError("Unable to load extended forecast.");
  }
}

/* Display 5-Day Forecast */
function displayForecast(list) {
  forecastContainer.innerHTML = "";
  forecastSection.classList.remove("hidden");

  // Filter: one forecast per day (12:00 PM)
  const dailyData = list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(day => {
    const date = new Date(day.dt_txt).toDateString();
    const temp = day.main.temp.toFixed(1);
    const wind = day.wind.speed;
    const humidity = day.main.humidity;
    const icon = day.weather[0].icon;
    const condition = day.weather[0].main;

    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow-md p-4 text-center hover:scale-105 transition";

    card.innerHTML = `
      <h3 class="font-semibold text-sm mb-2">${date}</h3>
      <img
        src="https://openweathermap.org/img/wn/${icon}@2x.png"
        class="mx-auto"
        alt="${condition}"
      />
      <p class="text-lg font-bold">${temp} °C</p>
      <p class="text-sm">💨 Wind: ${wind} m/s</p>
      <p class="text-sm">💧 Humidity: ${humidity}%</p>
    `;

    forecastContainer.appendChild(card);
  });
}
/* ================= ERROR HANDLING ================= */
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

function hideError() {
  errorMsg.classList.add("hidden");
}



/* ================= INIT ================= */
loadRecent();
