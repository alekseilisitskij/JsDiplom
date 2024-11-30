import authorization from "./autorization.js";
import { getAccountItem, sortColumn, flag } from "./accounts.js";
import { historyFirst } from "./account.js";
import { walletList } from "./currency.js";

export function renderAutorization(el) {
  el.innerHTML = "";
  el.append(authorization());
}

export function renderList(array, elem) {
  elem.innerHTML = "";
  let copyArray = [...array];

  copyArray = copyArray.sort((a, b) => {
    return (
      !flag ? a[sortColumn] < b[sortColumn] : a[sortColumn] > b[sortColumn]
    )
      ? -1
      : 1;
  });

  copyArray.forEach((item) => {
    elem.append(getAccountItem(item));
  });
}

export function renderListHistory(array, elem, obj) {
  elem.innerHTML = "";
  let copyArray = [...array];

  copyArray.reverse().forEach((item, i) => {
    if (i > 5) {
      return;
    }
    elem.append(historyFirst(item, obj));
  });
}

export function renderListCurrently(array, elem) {
  elem.innerHTML = "";

  for (const item in array.payload) {
    const { amount, code } = array.payload[item];
    elem.append(walletList(amount, code));
  }
}
