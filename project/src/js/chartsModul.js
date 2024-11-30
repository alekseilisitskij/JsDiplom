import { el } from "./utilities.js";

export function chartsModul() {
  const container = el("div", {
    classList: "container",
  });

  const chartTop = el("div", {
    classList: "chart__block-top",
  });

  const subtitleTop = el("h2", {
    classList: "translation__subtitle",
    textContent: "Динамика баланса",
  });

  const canvasTop = el("canvas", {
    id: "myChartFirst",
    width: "1000",
    height: "165",
  });

  const chartBottom = el("div", {
    classList: "chart__block-bottom",
  });

  const subtitleBottom = el("h2", {
    classList: "translation__subtitle",
    textContent: "Соотношение входящих исходящих транзакций",
  });

  const canvasBottom = el("canvas", {
    id: "myChartSecond",
    width: "1000",
    height: "165",
  });

  chartTop.append(subtitleTop, canvasTop);
  chartBottom.append(subtitleBottom, canvasBottom);
  container.append(chartTop, chartBottom);

  return container;
}
