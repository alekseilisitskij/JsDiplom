import { WorkApi } from "./WorkApi";

// Фун-я для сокращения элементов
const el = (tag, props) => {
  const element = document.createElement(tag);

  for (const key in props) {
    if (key === "classList") {
      Array.isArray(props[key])
        ? element.classList.add(...props[key])
        : element.classList.add(props[key]);
      continue;
    }

    if (key.startsWith("data-")) {
      element.setAttribute(key, props[key]);
      continue;
    }

    element[key] = props[key];
  }

  return element;
};

// Функция, чтобы брать дату с последней транзаций
const dateTransition = (array) => {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  if (array.length == 0) {
    const str = " ";
    return str;
  }
  const str = new Date(array.slice(-1)[0].date).toLocaleString(
    "default",
    options
  );

  return str;
};

const dateTransitionHistory = (date) => {
  const dateStr = new Date(date);

  const month = dateStr.toLocaleString("default", { month: "long" });
  const str = dateStr.getDate() + " " + month + " " + dateStr.getFullYear();
  return str;
};

// Функция для получения массива месяцов labels в chart js

function getLabels(array, numMonth) {
  const monthNames = [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];

  let nowTime = new Date();
  let nowAmout = {};

  array.map((item) => {
    const t = Date.parse(nowTime) - Date.parse(new Date(item.date));
    const days = Math.floor(t / (1000 * 60 * 60 * 24));

    if (days >= 0 && days <= numMonth) {
      const monthIndex = new Date(item.date).getMonth();
      const monthName = monthNames[monthIndex];

      if (!nowAmout[monthName]) {
        nowAmout[monthName] = 0;
      }
      // console.log(item.from);

      nowAmout[monthName] += item.amount;
      // console.log(nowAmout[monthName]);
    }
  });
  // console.log(removeDuplicates(nowAmout, monthNames));
  return removeDuplicates(nowAmout, monthNames);
}

// функция чтобы не повторялись месяца
function removeDuplicates(arr, months) {
  const currentMonthIndex = new Date().getMonth();
  // Перестроим массив месяцев, начиная с текущего месяца и заканчивая предыдущим
  const orderedMonths = [
    ...months.slice(currentMonthIndex + 1), // Месяцы после текущего
    ...months.slice(0, currentMonthIndex + 1), // Месяцы до и включая текущий
  ];

  return Object.keys(arr)
    .sort((a, b) => orderedMonths.indexOf(a) - orderedMonths.indexOf(b))
    .map((month) => ({
      month: month,
      amount: arr[month],
    }));
}

// Функция которая будет перебирать массив который получится от getLabels(array) ([{month: 'мар', balance: 40670.4}])

function getMonths(arr) {
  return arr.map((item) => {
    return item.month;
  });
}

function getBalance(arr, sum) {
  let sumAmount = 0;
  return arr.map((item) => {
    sumAmount += item.amount;
    return Math.round((sum -= sumAmount));
  });
}

// Подключение к WebSocket и подписка на пары:
function subscribeToPairs(ws, pairs) {
  const subscribeMessage = {
    action: "subscribe",
    pairs: pairs, // Массив валютных пар: ["EUR/USD", "USD/JPY"]
  };
  ws.send(JSON.stringify(subscribeMessage));
}
// функция для получения валют из твоего кошелька
async function getCurrentWallet() {
  let current = await WorkApi.getKnownCurrwncies();
  return current.payload;
}

export {
  el,
  dateTransition,
  dateTransitionHistory,
  getLabels,
  getMonths,
  getBalance,
  subscribeToPairs,
  getCurrentWallet,
};
