# Weather Forecast Application 🌦️

## Project Overview
This project is a **Weather Forecast Application** developed using **HTML, Tailwind CSS, and JavaScript**.  
The application allows users to search for real-time weather information by **city name** or **current location**, and also provides an **extended 5-day weather forecast**.

The goal of this project is to demonstrate API integration, responsive UI design, error handling, and clean JavaScript logic.

---

## Features
- Search weather by **city name**
- Fetch weather using **current location (geolocation)**
- Display **current weather details**
  - Temperature
  - Humidity
  - Wind speed
  - Weather condition with icon
- **5-day extended forecast** with daily cards
- **Recent searches dropdown** (stored using Local Storage)
- **Temperature unit toggle** (°C / °F for today’s temperature)
- **Extreme temperature alert** (above 40°C)
- **Dynamic background changes** based on weather condition (sunny, cloudy, rainy)
- Proper **error handling and validation** (no JavaScript alerts)
- Fully **responsive UI** (desktop, tablet, mobile)

---

## Technologies Used
- **HTML5** – Structure
- **Tailwind CSS** – Styling and responsive design
- **JavaScript (ES6)** – Logic and API handling
- **OpenWeatherMap API** – Weather data source

---

## API Used
- **OpenWeatherMap – Current Weather API**
- **OpenWeatherMap – 5 Day / 3 Hour Forecast API**

API Website: https://openweathermap.org/api

---

## Setup Instructions
1. Download or clone the project repository.
2. Open the project folder in **VS Code** or any code editor.
3. Create a free account on **OpenWeatherMap**.
4. Generate an API key from the OpenWeather dashboard.
5. Open `script.js` and replace the API key:
   ```js
   const API_KEY = "YOUR_API_KEY_HERE";

