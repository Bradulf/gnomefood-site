import { loadScene } from "./engine/loadScene";
import {desertScene} from "./scenes/desert/desert.ts";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `<div id="scene"></div>`;

loadScene(desertScene);
