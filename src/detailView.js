import { rootElement } from "../main";
import { getForecastWeather } from "./api";
import { renderLoadingScreen } from "./loading";
import { formatTemp } from "./utils";

export async function loadDetailView(cityName) {
  renderLoadingScreen();

  const weatherData = await getForecastWeather(cityName);
  renderDetailView(weatherData);
}

function renderDetailView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  const currentTemp = formatTemp(current.temp_c);
  const condition = current.condition.text;
  const maxTemp = formatTemp(currentDay.day.maxtemp_c);
  const minTemp = formatTemp(currentDay.day.mintemp_c);

  rootElement.innerHTML = getHeaderHtml(
    location.name,
    currentTemp,
    condition,
    maxTemp,
    minTemp,
  );
}

function getHeaderHtml(location, currentTemp, condition, maxTemp, minTemp) {
  return `
    <div class="current-weather">
      <h2 class="current-weather__location">${location}</h2>
      <h1 class="current-weather__current-temperature">${currentTemp}</h1>
      <p class="current-weather__condition">${condition}</p>
      <div class="current-weather__day-temperatures">
        <span class="current-weather__max-temperature">Max: ${maxTemp}</span>
        <span class="current-weather__min-temperature">Min: ${minTemp}</span>
      </div>
    </div>
  `;
}
