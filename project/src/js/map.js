import { el } from "./utilities";
import ymaps from "ymaps";

export function createMap(array) {
  const container = el("div", {
    classList: "container",
  });

  const title = el("h1", {
    classList: ["map__title", ["hero__title"]],
    textContent: "Карта банкоматов",
  });

  const map = el("div", {
    id: "map",
    classList: "map",
  });

  map.style.height = "768px";

  ymaps
    .load(
      "https://api-maps.yandex.ru/2.1/?apikey=ca823630-0a48-49c8-a6fe-284f7932907d&lang=ru_RU"
    )
    .then((maps) => {
      const map = new maps.Map("map", {
        center: [55.7472, 37.618],
        zoom: 11,
      });

      array.forEach((item) => {
        let placemark = new maps.Placemark(item, {}, {});
        map.geoObjects.add(placemark);
      });

      map.controls.remove("geolocationControl"); // удаляем геолокацию
      map.controls.remove("searchControl"); // удаляем поиск
      map.controls.remove("trafficControl"); // удаляем контроль трафика
      map.controls.remove("typeSelector"); // удаляем тип
      map.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
      map.controls.remove("zoomControl"); // удаляем контрол зуммирования
      map.controls.remove("rulerControl"); // удаляем контрол правил
      // map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)
    })
    .catch((error) => console.log("Failed to load Yandex Maps", error));

  container.append(title, map);
  return container;
}
