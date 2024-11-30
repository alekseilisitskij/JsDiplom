import { renderAutorization } from "./render.js";
import Navigo from "navigo";
import { WorkApi } from "./WorkApi.js";
import {
  accountCreateEl,
  main,
  btnCashmashina,
  btnAccounts,
  btnCurrency,
  btnExit,
} from "./accounts.js";
import { createAccount } from "./account.js";
import { currencyModal } from "./currency.js";
import { createMap } from "./map.js";

import "choices.js/public/assets/styles/choices.css";
import "../scss/spinner.scss";
import "../scss/style.scss";

export const router = new Navigo("/");

export const app = document.querySelector("#app");

btnAccounts.addEventListener("click", (e) => {
  e.preventDefault();
  router.navigate("/accounts");
});

btnCashmashina.addEventListener("click", (e) => {
  e.preventDefault();
  router.navigate("/banks");
});

btnCurrency.addEventListener("click", (e) => {
  e.preventDefault();
  router.navigate("/currenty");
});

btnExit.addEventListener("click", (e) => {
  e.preventDefault();
  router.navigate("/");
});

router.on("/", function () {
  renderAutorization(app);
});

router.on("/accounts", async function () {
  app.innerHTML = "";
  main.innerHTML = "";
  const token = window.localStorage.getItem("token");
  let array = await WorkApi.getAccounts(token);
  accountCreateEl(array.payload, token);
});

router.on("/account/:id", async function ({ data }) {
  main.innerHTML = "";
  const token = window.localStorage.getItem("token");
  const obj = await WorkApi.getAccount(data.id, token);
  createAccount(obj.payload);
});

router.on("/currenty", async function () {
  main.innerHTML = "";
  const token = window.localStorage.getItem("token");
  let array = await WorkApi.getCurrencyAccounts(token);
  currencyModal(array);
});

router.on("/banks", async function () {
  main.innerHTML = "";
  let obj = await WorkApi.getMap();
  let array = [];
  for (const item in obj.payload) {
    const { lat, lon } = obj.payload[item];
    let str = `${lat}/${lon}`;
    array.push(str.split("/"));
  }
  main.append(createMap(array));
});

router.notFound(() => {
  app.innerHTML = "404 - Страница не найдена";
});

router.resolve();
