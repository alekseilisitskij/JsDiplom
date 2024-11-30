module.exports = {
  readData,
  writeData,
  response,
  makeAccount,
  pregenerateMineCurrencies,
  premakeAccounts,
  formatAmount,
  generateAccountId,
  pregenerateHistory,
};

const fs = require("fs").promises;

const PUBLIC_DIR = "./public";

async function readData() {
  try {
    // console.log(`Чтение данных из: ${PUBLIC_DIR}/data.json`);
    const data = await fs.readFile(`${PUBLIC_DIR}/data.json`, "utf-8");
    // console.log("Прочитанные данные:", data); // Логируем прочитанные данные
    return JSON.parse(data);
  } catch (err) {
    console.error(`Ошибка при чтении данных: ${err}`);
    throw err;
  }
}

async function writeData(dataToWrite) {
  try {
    // console.log(`Запись данных в: ${PUBLIC_DIR}/data.json`);
    // console.log("Данные для записи:", JSON.stringify(dataToWrite, null, 4)); // Логируем данные для записи
    await fs.writeFile(
      `${PUBLIC_DIR}/data.json`,
      JSON.stringify(dataToWrite, null, 4),
      "utf-8"
    );
  } catch (err) {
    console.error(`Ошибка при записи данных: ${err}`);
    throw err;
  }
}

// function readData() {
//   return JSON.parse(fs.readFileSync(`${PUBLIC_DIR}/data.json`));
// }

// function writeData(dataToWrite) {
//   fs.writeFileSync(
//     `${PUBLIC_DIR}/data.json`,
//     JSON.stringify(dataToWrite, null, 4)
//   );
// }

function response(payload = null, error = "") {
  return JSON.stringify({
    payload,
    error,
  });
}

function formatAmount(number) {
  return Number(number.toFixed(2));
}

function generateAccountId() {
  return Array(26)
    .fill(0)
    .map(() => Math.floor(Math.random() * 9))
    .join("");
}

function makeAccount(mine = false, preseededId = "") {
  return {
    account: preseededId || generateAccountId(),
    mine,
    balance: 0,
    transactions: [],
  };
}

async function pregenerateMineCurrencies(data, knowCurrencies) {
  if (!data.mine) {
    data.mine = {};
  }
  if (!data.mine.currencies) {
    data.mine.currencies = {};
  }
  const currencies = data.mine.currencies;
  knowCurrencies.forEach((currency) => {
    if (!currencies[currency]) {
      currencies[currency] = {
        amount: Math.random() * 100,
        code: currency,
      };
    }
  });
  await writeData(data);
}

async function premakeAccounts(data, newAccounts, mine = false) {
  if (!data.accounts) {
    data.accounts = {};
  }
  const accounts = data.accounts;
  newAccounts.forEach((account) => {
    if (!accounts[account]) {
      accounts[account] = makeAccount(mine, account);
    }
  });
  await writeData(data);
}

async function pregenerateHistory(data, accounts, mine = false) {
  premakeAccounts(data, accounts, mine);
  const months = 10;
  const transactionsPerMonth = 5;
  accounts.forEach((accountId) => {
    const account = data.accounts[accountId];
    if (account.transactions.length >= months * transactionsPerMonth) {
      return;
    }

    const dayAsMs = 24 * 60 * 60 * 1000;
    const monthAsMs = 30 * dayAsMs;
    const yearAsMs = 12 * monthAsMs;
    let date = Date.now() - yearAsMs;

    for (let month = 0; month <= months; month++) {
      for (
        let transaction = 0;
        transaction <= transactionsPerMonth;
        transaction++
      ) {
        const sign = Math.random() < 0.5 ? 1 : -1;
        const amount = formatAmount(Math.random() * 10000);

        const otherAccountId = generateAccountId();
        const randomDaysOffset =
          (Math.random() - 0.5) * Math.random() * 5 * dayAsMs;

        account.transactions.push({
          date: new Date(date + randomDaysOffset).toISOString(),
          from: sign < 0 ? accountId : otherAccountId,
          to: sign > 0 ? accountId : otherAccountId,
          amount,
        });
      }
      date += monthAsMs;
    }
  });
}

// readData(): Читает данные из data.json и преобразует их в объект JavaScript.
// writeData(dataToWrite): Записывает предоставленные данные в data.json, форматируя их с отступами в 4 пробела.
// response(payload = null, error = ""): Создает объект ответа с необязательными полями payload и error, а затем преобразует его в строку.
// formatAmount(number): Форматирует число до двух десятичных знаков.
// generateAccountId(): Генерирует случайный идентификатор аккаунта из 26 цифр.
// makeAccount(mine = false, preseededId = ""): Создает объект аккаунта с случайным или заданным идентификатором, флагом mine и инициализированным балансом и транзакциями.
// pregenerateMineCurrencies(data, knowCurrencies): Добавляет валюты в объект data, если их там еще нет, и инициализирует их суммы.
// premakeAccounts(data, newAccounts, mine = false): Добавляет новые аккаунты в объект data, если их там еще нет, используя функцию makeAccount.
// pregenerateHistory(data, accounts, mine = false): Генерирует историю транзакций для указанных аккаунтов, создавая случайные транзакции на протяжении 10 месяцев.
