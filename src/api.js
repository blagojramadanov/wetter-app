const API_BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "71d40fdc3525490d8a6191622260202";

export async function getForecastWeather(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de&days=${days}`,
  );
  console.log(weatherData);
  const weatherData = await response.json();
  return weatherData;
}
