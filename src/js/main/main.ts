import App from "./main.svelte";
import {mount} from "svelte";
import { initBolt } from "../lib/utils/bolt";

initBolt();

const target = document.querySelector('#root');
if (!target) {
    throw new Error("Target element '#root' not found in the DOM.");
}

const app = mount(App, { target });
export default app;
