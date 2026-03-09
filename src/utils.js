export function formatTemp(temp) {
  return `${Math.round(temp)}°C`;
}

export const debounce = (callback, wait = 500) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};
