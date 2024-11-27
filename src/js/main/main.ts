import { mount } from 'svelte';
import App from "./main.svelte";
import { initBolt } from "../lib/utils/bolt";

initBolt();

//@ts-ignore
const app = mount(App, {target: document.querySelector('#root')});

export default app;
