import { Chart, registerables } from "chart.js";
import { getLabels, getMonths, getBalance } from "./utilities";

Chart.register(...registerables);

export const createChartBalance = (balance, transactions, account) => {
  let newTransactionsTo = transactions.filter((item) => {
    return account == item.to;
  });

  const ctx = document.getElementById("myChart");
  let sum = balance;

  new Chart(ctx, {
    type: "bar",
    allowHTML: true,
    data: {
      labels: getMonths(getLabels(newTransactionsTo, 175)),
      datasets: [
        {
          data: getBalance(getLabels(newTransactionsTo, 175), sum).reverse(),
          borderWidth: 1,
          backgroundColor: "#116ACC",
          barPercentage: 0.75,
          categoryPercentage: 0.85,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              size: "20px",
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Убираем сетку по оси X
          },
          ticks: {
            font: {
              size: 20,
              fontStyle: "bold",
              color: "#000",
            },
          },
        },
        y: {
          position: "right",
          beginAtZero: true,
          grid: {
            display: false, // Убираем сетку по оси Y
          },
          min: 0, // Минимальное значение
          max: Math.round(balance),
          ticks: {
            font: {
              size: 20,
              color: "#000",
            },
            callback: function (value, index, values) {
              // Отображаем только 0 и 3000
              return value === 0 || value === Math.round(balance) ? value : "";
            },
          }, // Максимальное значение
        },
      },
    },
  });
};

export const createCharts = (balance, transactions, account) => {
  let newTransactionsTo = transactions.filter((item) => {
    return account == item.to;
  });

  let newTransactionsFrom = transactions.filter((item) => {
    return account == item.from;
  });

  const myChartFirst = document.getElementById("myChartFirst");

  let sum = balance;

  new Chart(myChartFirst, {
    type: "bar",
    allowHTML: true,
    data: {
      labels: getMonths(getLabels(newTransactionsTo, 350, account)),
      datasets: [
        {
          data: getBalance(
            getLabels(newTransactionsTo, 350, account),
            sum
          ).reverse(),
          borderWidth: 1,
          backgroundColor: "#116ACC",
          barPercentage: 0.75,
          categoryPercentage: 0.85,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              size: "20px",
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Убираем сетку по оси X
          },
          ticks: {
            font: {
              size: 20,
              fontStyle: "bold",
              color: "#000",
            },
          },
        },
        y: {
          position: "right",
          beginAtZero: true,
          grid: {
            display: false, // Убираем сетку по оси Y
          },
          min: 0, // Минимальное значение
          max: Math.round(balance),
          ticks: {
            font: {
              size: 20,
              color: "#000",
            },
            callback: function (value, index, values) {
              // Отображаем только 0 и 3000
              if (
                value === 0 ||
                value === 1500 ||
                value === Math.round(balance)
              ) {
                return value;
              }
              return "";
            },
          }, // Максимальное значение
        },
      },
    },
  });
  // /////////////////////////////////////////////////////////

  const myChartSecond = document.getElementById("myChartSecond");

  new Chart(myChartSecond, {
    type: "bar",
    allowHTML: true,
    data: {
      labels: getMonths(getLabels(newTransactionsTo, 350, account)),
      datasets: [
        {
          label: "Доходные транзакции",
          data: getBalance(
            getLabels(newTransactionsTo, 350, account),
            sum
          ).reverse(),
          backgroundColor: "#FD4E5D",
          stack: "Stack 0",
          borderWidth: 1,
          barPercentage: 0.75,
          categoryPercentage: 0.85,
        },
        {
          label: "Расходные транзакции",
          data: getBalance(
            getLabels(newTransactionsFrom, 350, account),
            sum
          ).reverse(), // Проценты расходных транзакций
          backgroundColor: "#76CA66",
          stack: "Stack 0",
          borderWidth: 1,
          barPercentage: 0.75,
          categoryPercentage: 0.85,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          legend: {
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
          display: false,
          labels: {
            font: {
              size: "20px",
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Убираем сетку по оси X
          },
          ticks: {
            font: {
              size: 20,
              fontStyle: "bold",
              color: "#000",
            },
          },
        },
        y: {
          position: "right",
          beginAtZero: true,
          grid: {
            display: false, // Убираем сетку по оси Y
          },
          min: 0, // Минимальное значение
          max: Math.round(balance),
          ticks: {
            font: {
              size: 20,
              color: "#000",
            },
            callback: function (value, index, values) {
              // Отображаем только 0, 1500 и 3000
              if (
                value === 0 ||
                value === 1500 ||
                value === Math.round(balance)
              ) {
                return value;
              }
              return "";
            },
          },
        },
      },
    },
  });
};
