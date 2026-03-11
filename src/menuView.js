import { Storage } from "./storage.js";
import { loadDetailView } from "./detailView.js";
import { getForecastWeather } from "./api.js";
import { debounce } from "./utils.js";

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

export const MenuView = {
  render: () => {
    const root = document.getElementById("app");
    root.innerHTML = `
   <div class="menu-background">
     <div class="weather-icons">
    <div class="icon sun">☀</div>
    <div class="icon cloud">☁</div>
    <div class="icon rain">🌧</div>
    <div class="icon cloud">☁</div>
    <div class="icon sun">☀</div>
    </div>
  </div>

<div class="menu-container">

  <div class="menu-header">
    <h1>Wetter</h1>
    <button id="edit-btn">Abrechnen</button>
  </div>

  <div class="search-container">
    <input type="text" id="city-input" placeholder="Nach Stadt suchen..." />
    <button id="search-btn">Suchen</button>
  </div>

  <ul id="saved-cities-list" class="saved-cities"></ul>

</div>
`;
    MenuView.renderSavedCities();
    MenuView.bindEvents();
  },

  renderSavedCities: async () => {
    const list = document.getElementById("saved-cities-list");
    list.innerHTML = "";
    const cities = Storage.getCities();

    for (const city of cities) {
      try {
        const { location, current, forecast } = await getForecastWeather(city);
        const today = forecast.forecastday[0];
        const bg = getBackgroundImage(current.condition.text, current.is_day);
        const li = document.createElement("li");
        li.className = "saved-city";
        li.style.backgroundImage = `url('${bg}')`;
        li.innerHTML = `
          <div class="overlay"></div>
          <div class="city-info">
            <div class="city-name">${location.name}</div>
            <div class="country">${location.country}</div>
            <div class="bottom-row">
              <div class="condition">${current.condition.text}</div>
              <div class="temp">${Math.round(current.temp_c)}°</div>
            </div>
          </div>
          <button class="delete-btn">✖</button>
        `;
        li.querySelector(".delete-btn").style.display = "none";
        li.querySelector(".city-info").addEventListener("click", () =>
          loadDetailView(city),
        );
        li.querySelector(".delete-btn").addEventListener("click", () => {
          Storage.removeCity(city);
          MenuView.renderSavedCities();
        });
        list.appendChild(li);
      } catch (err) {
        console.error("Error loading city", city, err);
      }
    }

    const editBtn = document.getElementById("edit-btn");
    editBtn.addEventListener("click", () => {
      const deleteBtns = document.querySelectorAll(".saved-city .delete-btn");
      const isActive = editBtn.classList.toggle("active");
      deleteBtns.forEach(
        (btn) => (btn.style.display = isActive ? "block" : "none"),
      );
    });
  },

  bindEvents: () => {
    const input = document.getElementById("city-input");
    const searchBtn = document.getElementById("search-btn");

    const handleSearch = async () => {
      const city = input.value.trim();
      if (city) {
        const { location } = await getForecastWeather(city);
        if (location.name.toLowerCase() !== city.toLowerCase()) {
          alert(`Stadt "${city}" nicht gefunden. Verscuh Nocmal`);
          return;
        }
        loadDetailView(city);
        input.value = "";
      }
    };
    searchBtn.addEventListener("click", handleSearch);
  },
};
