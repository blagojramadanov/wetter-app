const rootElement = document.getElementById("app");

export function showLoading(message = "Lade...") {
  rootElement.innerHTML = `
    <div class="loader-wrapper">
      <div class="spinner-circle"></div>
      <p class="loading-text">${message}</p>
    </div>
  `;
}
