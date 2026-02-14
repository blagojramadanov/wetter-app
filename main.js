import { loadDetailView } from "./src/detailView";
import { renderLoadingScreen } from "./src/loading";
import "./styles/styles.scss";

export const rootElement = document.getElementById("app");

loadDetailView("London");
renderLoadingScreen();
