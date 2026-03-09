const STORAGE_KEY = "savedCities";

export const Storage = {
  getCities: () => {
    try {
      const cities = localStorage.getItem(STORAGE_KEY);
      if (!cities) return [];
      return JSON.parse(cities);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  },

  saveCity: (city) => {
    const cities = Storage.getCities();
    if (!cities.includes(city)) {
      cities.push(city);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    }
  },

  removeCity: (city) => {
    let cities = Storage.getCities();
    cities = cities.filter((c) => c !== city);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
