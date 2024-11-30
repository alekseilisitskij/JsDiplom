import { initializeChoices } from "./select.js";
import { app } from "./main.js";
import { el, dateTransition } from "./utilities.js";
import { router } from "./main.js";
import { renderList } from "./render.js";
import { WorkApi } from "./WorkApi.js";
import { translation } from "./account.js";

export let sortColumn = "balance";
export let flag = false;
const localstrToken = window.localStorage.getItem("token");

export const main = el("main", {
  classList: "main",
});

export const btnCashmashina = el("button", {
  classList: ["btn", "btn-reset", "btn__group", "btn__group_cashMashina"],
  textContent: "Банкоматы",
});

export const btnAccounts = el("button", {
  classList: ["btn", "btn-reset", "btn__group", "btn__group_accounts"],
  textContent: "Счета",
});

export const btnCurrency = el("button", {
  classList: ["btn", "btn-reset", "btn__group", "btn__group_currency"],
  textContent: "Валюта",
});

export const btnExit = el("button", {
  classList: ["btn", "btn-reset", "btn__group", "btn__group_exit"],
  textContent: "Выйти",
});

export function accountCreateEl(array) {
  const header = el("header", {
    classList: "header",
  });

  const containerHeader = el("div", {
    classList: ["container", "header__container"],
  });

  const linkHeader = el("a", {
    href: "#",
    classList: "header__logo",
    textContent: "Coin.",
  });

  const buttonsList = el("nav", {
    classList: "buttons-list",
  });

  const heroSection = el("section", {
    classList: "hero",
  });

  const heroContainer = el("div", {
    classList: ["container", "hero__container"],
  });

  const heroForm = el("form", {
    classList: "hero__form",
  });

  const heroLabel = el("label", {
    classList: "hero__label",
    textContent: "Ваши счета",
  });

  const heroSelect = el("select", {
    classList: "hero__sort",
    name: "sort",
  });

  const heroOption = el("option", {
    value: "",
    textContent: "Сортировка",
  });

  const heroOption2 = el("option", {
    value: "account",
    textContent: "По номеру",
    "data-select-option": "account",
  });

  const heroOption3 = el("option", {
    value: "balance",
    textContent: "По балансу",
    "data-select-option": "balance",
  });

  const heroOption4 = el("option", {
    value: "transactions",
    textContent: "По последней транзакции",
    "data-select-option": "transactions",
  });

  heroSelect.addEventListener("change", function (e) {
    sortColumn = this.value;
    flag = !flag;

    renderList(array, accountsList);
  });

  const heroBtn = el("button", {
    classList: ["btn", "btn-reset", "hero__btn"],
    textContent: "+ Создать новый счёт",
  });

  heroBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    accountsList.innerHTML = "";
    let obj = await WorkApi.createAccount(localstrToken);
    array.push(obj.payload);
    renderList(array, accountsList);
  });

  const accountsSection = el("section", {
    classList: "accounts",
  });

  const accountsContainer = el("div", {
    classList: ["container", "accounts__container"],
  });

  const accountsList = el("ul", {
    classList: ["list-reset", "accounts__list"],
  });

  renderList(array, accountsList);

  accountsContainer.append(accountsList);
  accountsSection.append(accountsContainer);

  heroSelect.append(heroOption, heroOption2, heroOption3, heroOption4);
  heroForm.append(heroLabel, heroSelect);
  heroContainer.append(heroForm, heroBtn);
  heroSection.append(heroContainer);
  main.append(heroSection, accountsSection);

  buttonsList.append(btnCashmashina, btnAccounts, btnCurrency, btnExit);
  containerHeader.append(linkHeader, buttonsList);
  header.append(containerHeader);
  app.append(header, main);

  initializeChoices(heroSelect);
}

export function getAccountItem({ account, balance, transactions }) {
  const accountsItem = el("li", {
    classList: "accounts__item",
  });

  const blockLeft = el("div", {
    classList: "accounts__item_left",
  });

  const accountsSubtitle = el("h2", {
    classList: ["subtitle", "accounts__subtitle"],
    textContent: account,
  });

  const price = el("span", {
    classList: "accounts__price",
    textContent: `${balance} руб`,
  });

  const descr = el("div", {
    classList: "accounts__descr_text",
    textContent: "Последняя транзакция",
  });

  const spanDescr = el("span", {
    classList: "accounts__descr",
    textContent: `${dateTransition(transactions)}`,
  });

  const blockRight = el("div", {
    classList: "accounts__right",
  });

  const btn = el("button", {
    classList: ["btn", "btn-reset", "accounts__btn"],
    textContent: "Открыть",
  });

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    translation.innerHTML = "";
    router.navigate(`/account/${account}`);
  });

  descr.append(spanDescr);
  blockLeft.append(accountsSubtitle, price, descr);
  blockRight.append(btn);
  accountsItem.append(blockLeft, blockRight);
  return accountsItem;
}
