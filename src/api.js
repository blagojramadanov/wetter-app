const API_BASE_URL = "https://api.weatherapi.com/v1";
const API_KEY = "1358102d3d0b46d091b150258261902";

export async function getForecastWeather(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de&days=${days}`,
  );

  if (!response.ok) {
    throw new Error("API error");
  }

  return await response.json();
}
