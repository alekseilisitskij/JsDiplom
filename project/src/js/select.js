import Choices from "choices.js";

export function initializeChoices(element) {
  return new Choices(element, {
    searchEnabled: false,
    itemSelectText: "",
    shouldSort: false,
  });
}
