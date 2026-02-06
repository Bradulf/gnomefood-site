import { loadDesert } from "./scenes/desert/desert";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `<div id="scene"></div>`;

loadDesert();
