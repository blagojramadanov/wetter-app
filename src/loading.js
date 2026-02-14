import { rootElement } from "../main";

export function showLoading(message = "Lädt...") {
  rootElement.innerHTML = `
        <div class="loading">
            <div class="loading__spinner"></div>
            <p class="loading__text">${message}</p>
        </div>
    `;
}
