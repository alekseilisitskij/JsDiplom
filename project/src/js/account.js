import { createChartBalance, createCharts } from "./chartBalance.js";
import { renderListHistory } from "./render.js";
import { el, dateTransitionHistory } from "./utilities";
import { WorkApi } from "./WorkApi.js";
import { main } from "./accounts.js";
import { chartsModul } from "./chartsModul.js";

export const translation = el("section", {
  classList: "translation",
});

export function createAccount({ account, balance, transactions }) {
  const heroSection = el("section", {
    classList: "hero",
  });

  const container = el("div", {
    classList: ["container", "hero__container-account"],
  });

  const blockTop = el("div", {
    classList: "hero__block-top",
  });

  const title = el("p", {
    classList: "hero__title",
    textContent: "Просмотр счёта",
  });

  const heroBtn = el("button", {
    classList: ["btn", "btn-reset", "hero__btn"],
    textContent: "Вернуться назад",
  });

  const blockBottom = el("div", {
    classList: "hero__block-bottom",
  });

  const subtitle = el("p", {
    classList: "hero__subtitle",
    textContent: account,
  });

  const balanceHero = el("div", {
    classList: "hero__balance",
    textContent: "Баланс",
  });

  const spanBalance = el("span", {
    classList: "hero__balance_span",
    textContent: `${Math.round(balance)}p`,
  });

  const translationContainer = el("div", {
    classList: ["container", "translation__container"],
  });

  const blockLeft = el("div", {
    classList: "translation__block-left",
  });

  const translationSubtitle = el("p", {
    classList: "translation__subtitle",
    textContent: "Новый перевод",
  });

  const form = el("form", {
    classList: "translation__form",
  });

  const blockInput = el("div", {
    classList: "translation__input-block",
  });

  const labelAccount = el("label", {
    classList: "translation__label",
    textContent: "Номер счёта получателя",
  });

  const inpurAccount = el("input", {
    classList: "translation__input-send",
    type: "number",
    name: "translation",
    placeholder: "Счёт",
  });

  const errorAccount = el("div", {
    classList: "error-account",
    textContent: "Не существующий счет",
  });

  const blockInput2 = el("div", {
    classList: "translation__input-block",
  });

  const labelSum = el("label", {
    classList: ["translation__label", "translation__label_summa"],
    textContent: "Сумма перевода",
  });

  const inpurSum = el("input", {
    classList: "translation__input-send",
    type: "number",
    name: "amount",
    placeholder: "Сумма",
  });

  const translationBtn = el("button", {
    classList: ["btn", "btn-reset", "translation__btn"],
    textContent: "Отправить",
  });

  const linkBlockRight = el("a", {
    classList: "translation__link",
  });

  const blockRight = el("div", {
    classList: "translation__block-right",
  });

  const blRightSubtitle = el("h2", {
    classList: "translation__subtitle",
    textContent: "Динамика баланса",
  });

  const canvas = el("canvas", {
    id: "myChart",
    width: "510",
    height: "165",
  });

  const history = el("section", {
    classList: "history",
  });

  const historyContainer = el("div", {
    classList: ["container", "history__container"],
  });

  const historyTitle = el("h2", {
    classList: "history__title",
    textContent: "История переводов",
  });

  const table = el("table", {
    classList: "history__table",
  });

  const thead = el("thead", {
    classList: "history__thead",
  });

  const tr = document.createElement("tr");

  const arrayTh = ["Счёт отправителя", "Счёт получателя", "Сумма", "Дата"];

  for (let i = 0; i < arrayTh.length; i++) {
    const th = document.createElement("th");
    th.textContent = arrayTh[i];
    tr.append(th);
  }

  const tbody = document.createElement("tbody");

  heroBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
  });

  linkBlockRight.addEventListener("click", () => {
    translation.innerHTML = "";

    translation.append(chartsModul());
    createCharts(balance, transactions, account);
  });

  translationBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    errorAccount.innerHTML = "";

    if (inpurSum.value == "") {
      errorAccount.style.display = "block";
      errorAccount.textContent = "Не указана сумма перевода";

      return;
    }

    if (inpurAccount.value == "") {
      errorAccount.style.display = "block";
      errorAccount.textContent = "Не указана счет";

      return;
    }

    let obj = await WorkApi.transferFunds(
      account,
      inpurAccount.value,
      inpurSum.value,
      window.localStorage.getItem("token")
    );
    inpurAccount.value = "";
    inpurSum.value = "";

    switch (obj.error) {
      case "Invalid account to":
        errorAccount.style.display = "block";
        errorAccount.textContent = "Не указан счёт зачисления";
        break;

      case "Overdraft prevented":
        errorAccount.style.display = "block";
        errorAccount.textContent = "Вы попытались перевести больше денег";
        break;

      default:
        return obj;
    }
  });

  renderListHistory(transactions, tbody, account);

  thead.append(tr);
  table.append(thead, tbody);
  historyContainer.append(historyTitle, table);
  history.append(historyContainer);

  blockRight.append(blRightSubtitle, canvas);
  linkBlockRight.append(blockRight);

  blockInput2.append(labelSum, inpurSum);
  blockInput.append(labelAccount, inpurAccount);
  form.append(blockInput, blockInput2, translationBtn, errorAccount);
  blockLeft.append(translationSubtitle, form);

  translationContainer.append(blockLeft, linkBlockRight);
  translation.append(translationContainer);

  balanceHero.append(spanBalance);
  blockBottom.append(subtitle, balanceHero);
  blockTop.append(title, heroBtn);
  container.append(blockTop, blockBottom);
  heroSection.append(container);
  main.append(heroSection, translation, history);

  createChartBalance(balance, transactions, account);
}

export function historyFirst({ from, to, amount, date }, obj) {
  const tr = document.createElement("tr");

  const td = el("td", {
    textContent: from,
  });

  const td2 = el("td", {
    textContent: to,
  });

  const td3 = el("td", {
    textContent: amount,
  });

  obj !== from ? (td3.style.color = "green") : (td3.style.color = "red");

  const td4 = el("td", {
    textContent: `${dateTransitionHistory(date)}`,
  });

  tr.append(td, td2, td3, td4);
  return tr;
}
