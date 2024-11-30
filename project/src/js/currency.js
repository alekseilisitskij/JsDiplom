import { main } from "./accounts";
import { el, subscribeToPairs, getCurrentWallet } from "./utilities";
import { WorkApi } from "./WorkApi";
import { renderListCurrently } from "./render";

let array = [];
let res = new WebSocket("ws://localhost:3000/currency-feed");
let currency = [
  "ETH/AUD",
  "BTC/CAD",
  "BTC/EUR",
  "BTC/CHF",
  "BTC/USD",
  "CHF/EUR",
  "CHF/UAH",
  "CHF/USD",
  "CNH/USD",
  "EUR/GBP",
  "USD/CAD",
  "USD/RUB",
];

// Преобразуем массив валютных пар в Set для быстрого поиска
const currencySet = new Set(currency);

export async function currencyModal(arr) {
  const container = el("div", {
    classList: "container",
  });

  const title = el("h1", {
    classList: ["currency__title", "hero__title"],
    textContent: "Валютный обмен",
  });

  const sectionCurrency = el("section", {
    classList: "currency",
  });

  const currencyBlock = el("div", {
    classList: "currency__your",
  });

  const subtitleCur = el("h2", {
    classList: "currency__subtitle",
    textContent: "Ваши валюты",
  });

  const listWallet = el("ul", {
    classList: ["list-reset", "currency__list_wallet"],
  });

  renderListCurrently(arr, listWallet);

  const courseBlock = el("div", {
    classList: "change__course",
  });

  const subtitleCourse = el("h2", {
    classList: "currency__subtitle",
    textContent: "Изменение курсов в реальном времени",
  });

  const listCourse = el("ul", {
    classList: ["list-reset", "currency__list_course"],
  });

  const spinner = el("div", {
    classList: ["loader", "loader__link"],
  });

  res.onopen = () => {
    console.log("WebSocket соединение открыто");
    subscribeToPairs(res, currency);
  };
  spinner.style.display = "block";
  res.onmessage = (e) => {
    const message = JSON.parse(e.data);

    if (message.type === "EXCHANGE_RATE_CHANGE") {
      const pair = `${message.from}/${message.to}`;
      if (currencySet.has(pair)) {
        spinner.style.display = "none";
        listCourse.append(coupleWalletList(message));
      }
    }
  };

  res.onerror = (error) => {
    console.error("Ошибка WebSocket:", error);
  };

  res.onclose = () => {
    console.log("WebSocket соединение закрыто");
  };

  // ////////////////////////////////////////

  const blockExchange = el("div", {
    classList: "currency__exchange",
  });

  const subtitleExchange = el("h2", {
    classList: "currency__subtitle",
    textContent: "Обмен валют",
  });

  const blockForm = el("div", {
    classList: "block__form",
  });

  const formCurrency = el("form", {
    classList: "currency__form",
  });

  const blockFormCurrency = el("div", {
    classList: "currency__block-form",
  });

  const blockFrom = el("div", {
    classList: "currency__block-form_from",
  });

  const labelFrom = el("label", {
    classList: "currency__label",
    textContent: "Из",
  });

  const selectFrom = el("select", {
    name: "currency",
    id: "currency",
    classList: "currency__select",
  });

  const blockTo = el("div", {
    classList: "currency__block-form_to",
  });

  const labelTo = el("label", {
    classList: "currency__label",
    textContent: "в",
  });

  const selectTo = el("select", {
    name: "currency",
    id: "currency",
    classList: "currency__select",
  });

  const blockSumma = el("div", {
    classList: "currency__block-form_summa",
  });

  const labelSumma = el("label", {
    classList: "currency__label",
    textContent: "Сумма",
  });

  const inputCurrency = el("input", {
    type: "number",
    name: "name",
    classList: "currency__block-form_input",
  });

  const blockErrSumma = el("div", {
    classList: "currency__block-error",
  });

  const blockBtn = el("div", {
    classList: "currency__block-btn",
  });

  const btnCurrency = el("button", {
    classList: ["btn", "btn-reset", "currency__btn"],
    textContent: "Обменять",
  });

  let arrCurrent = await getCurrentWallet();

  arrCurrent.forEach((item) => {
    const optionFrom = el("option", {
      value: item,
      textContent: item,
    });

    const optionTo = el("option", {
      value: item,
      textContent: item,
    });

    selectFrom.append(optionFrom);
    selectTo.append(optionTo);
  });

  btnCurrency.addEventListener("click", async () => {
    blockErrSumma.style.display = "none";

    let postCurr = await WorkApi.exchangeCurrency(
      selectFrom.value,
      selectTo.value,
      inputCurrency.value,
      window.localStorage.getItem("token")
    );

    let array = await WorkApi.getCurrencyAccounts(
      window.localStorage.getItem("token")
    );

    switch (postCurr.error) {
      case "Overdraft prevented":
        blockErrSumma.style.display = "block";
        blockErrSumma.textContent =
          "Попытка перевести больше, чем доступно на счёте списания.";
        break;
      case "Not enough currency":
        blockErrSumma.style.display = "block";
        blockErrSumma.textContent = "На валютном счёте списания нет средств";
        break;
      case "Invalid amount":
        blockErrSumma.style.display = "block";
        blockErrSumma.textContent =
          "Не указана сумма перевода, или она отрицательная";
        break;
      case "Unknown currency code":
        blockErrSumma.style.display = "block";
        blockErrSumma.textContent = "Передан неверный валютный код";
        break;
      default:
        console.log("Отправлено");
        break;
    }

    renderListCurrently(array, listWallet);
  });

  blockBtn.append(btnCurrency);

  blockFrom.append(labelFrom, selectFrom);
  blockTo.append(labelTo, selectTo);
  blockFormCurrency.append(blockFrom, blockTo);

  blockSumma.append(labelSumma, inputCurrency, blockErrSumma);

  formCurrency.append(blockFormCurrency, blockSumma);
  blockForm.append(formCurrency, blockBtn);
  blockExchange.append(subtitleExchange, blockForm);

  courseBlock.append(subtitleCourse, listCourse, spinner);
  currencyBlock.append(subtitleCur, listWallet);
  sectionCurrency.append(currencyBlock, courseBlock, blockExchange);
  container.append(title, sectionCurrency);
  main.append(container);
}

export function walletList(amount, code) {
  const li = el("li", {
    classList: "currency__item_wallet",
  });

  const blockName = el("div", {
    classList: "currency__name",
    textContent: code,
  });

  const blockDot = el("div", {
    classList: "currency__dot",
  });

  const blockSumma = el("div", {
    classList: "currency__summa",
    textContent: Math.round(amount),
  });

  li.append(blockName, blockDot, blockSumma);
  return li;
}

function coupleWalletList(data) {
  if (array.length > 22) {
    res.close();
  }

  const li = el("li", { classList: "currency__item_course" });

  const blockName = el("div", {
    classList: "currency__couple-name_course",
    textContent: `${data.from}/${data.to}`,
  });

  let arrSumma;
  let arrDot;
  if (data.change == 1) {
    arrSumma = ["currency__summa_course", "top"];
    arrDot = ["currency__dot_course", "currency__dot_course-green"];
  } else {
    arrSumma = ["currency__summa_course", "bottom"];
    arrDot = ["currency__dot_course", "currency__dot_course-red"];
  }

  const blockDot = el("div", { classList: arrDot });

  const blockSumma = el("div", {
    classList: arrSumma,
    textContent: data.rate,
  });

  li.append(blockName, blockDot, blockSumma);

  array.push(li);

  return li;
}
