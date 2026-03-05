import { getForecastWeather } from "./api.js";
import { showLoading } from "./loading.js";
import { formatTemp } from "./utils.js";
import { Storage } from "./storage.js";
import { MenuView } from "./menuView.js";

const root = document.getElementById("app");

function getBackgroundImage(conditionText, isDay = 1) {
  const text = conditionText.toLowerCase();
  if (
    text.includes("storm") ||
    text.includes("thunder") ||
    text.includes("gewitter")
  )
    return "images/storm.JPG";
  if (text.includes("snow") || text.includes("schnee"))
    return "images/snow.JPG";
  if (
    text.includes("rain") ||
    text.includes("regen") ||
    text.includes("drizzle") ||
    text.includes("shower")
  )
    return "images/rain.JPG";
  if (
    text.includes("cloud") ||
    text.includes("bewölkt") ||
    text.includes("overcast") ||
    text.includes("partly")
  )
    return isDay ? "images/cloudy.JPG" : "images/cloudy-night.JPG";
  if (
    text.includes("sun") ||
    text.includes("sonnig") ||
    text.includes("clear") ||
    text.includes("klar")
  )
    return isDay ? "images/sunny-day.JPG" : "images/clear-night.JPG";
  return "images/default.JPG";
}

export async function loadDetailView(cityName) {
  showLoading();
  try {
    const { location, current, forecast } = await getForecastWeather(cityName);
    const today = forecast.forecastday[0];
    const tomorrow = forecast.forecastday[1] || { hour: [] };
    const allHours = [...today.hour, ...tomorrow.hour];
    const nowMs = new Date().getTime();
    const next24Hours = allHours
      .filter((h) => new Date(h.time).getTime() >= nowMs)
      .slice(0, 24);

    const hourlyHtml = next24Hours
      .map(
        (h, idx) => `
      <div class="hour-card ${idx === 0 ? "current-hour" : ""}">
        <p>${idx === 0 ? "Jetzt" : h.time.split(" ")[1]}</p>
        <img src="https:${h.condition.icon}" />
        <p>${formatTemp(h.temp_c)}</p>
      </div>
    `,
      )
      .join("");

    const daysHtml = forecast.forecastday
      .map(
        (day, idx) => `
      <div class="day-row">
        <p>${idx === 0 ? "Heute" : new Date(day.date).toLocaleDateString("de-DE", { weekday: "short" })}</p>
        <img src="https:${day.day.condition.icon}" />
        <p>H:${formatTemp(day.day.maxtemp_c)} T:${formatTemp(day.day.mintemp_c)}</p>
        <p>Wind: ${day.day.maxwind_kph} km/h</p>
      </div>
    `,
      )
      .join("");

    const bgImage = getBackgroundImage(current.condition.text, current.is_day);

    root.innerHTML = `
<div class="weather-app" style="background-image: url('${bgImage}')">
  <div class="weather-app__overlay">
    <div class="weather-app__header">
      <button id="back-btn">⬅</button>
      <div class="header-center">
        <h2>${location.name}</h2>
        <h1>${formatTemp(current.temp_c)}</h1>
        <p>${current.condition.text}</p>
        <p>H:${formatTemp(today.day.maxtemp_c)} T:${formatTemp(today.day.mintemp_c)}</p>
      </div>
      <button id="favorite-btn">⭐</button>
    </div>

    <div class="weather-app__hourly">${hourlyHtml}</div>
    <div class="weather-app__forecast">
      <h3>Vorhersage für die nächsten 3 Tage:</h3>
      ${daysHtml}
    </div>

    <div class="weather-app__grid">
      ${[
        ["Feuchtigkeit", `${current.humidity}%`],
        ["Gefühlt", formatTemp(current.feelslike_c)],
        ["Sonnenaufgang", today.astro.sunrise],
        ["Sonnenuntergang", today.astro.sunset],
        ["Niederschlag", `${current.precip_mm} mm`],
        ["UV-Index", current.uv],
      ]
        .map(
          ([label, value]) =>
            `<div class="info-card"><p>${label}</p><h3>${value}</h3></div>`,
        )
        .join("")}
    </div>
  </div>
</div>
`;

    document
      .getElementById("back-btn")
      .addEventListener("click", () => MenuView.render());
    document.getElementById("favorite-btn").addEventListener("click", () => {
      Storage.saveCity(location.name);
      alert(`${location.name} als Favorit gespeichert!`);
    });
  } catch (error) {
    root.innerHTML = "<p>Fehler (falsch gegeben)</p>";
    console.error(error);
  }
}
