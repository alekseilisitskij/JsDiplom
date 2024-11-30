import { el } from "./utilities.js";
import validator from "validator";
import { router } from "./main.js";
import { WorkApi } from "./WorkApi.js";

export default function createElements() {
  // Создаю элементы для авторизации
  const container = el("div", {
    classList: "firstblock",
  });

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

  const block = el("div", {
    classList: "block",
  });

  const blockContainer = el("div", {
    classList: "container",
  });

  const blockForm = el("div", {
    classList: "form__block",
  });

  const formTitle = el("h1", {
    classList: "form__title",
    textContent: "Вход в аккаунт",
  });

  const formOpen = el("form", {
    classList: "form__open",
  });

  const formOpenInp = el("div", {
    classList: "form__open-inputbox",
  });

  const labelLogin = el("label", {
    classList: "login",
    textContent: "Логин",
  });

  const inputLogin = el("input", {
    classList: "form__open-input",
    name: "name",
    type: "text",
    placeholder: "Логин",
    "data-input": "login",
  });

  const blockError = el("div", {
    classList: "error-label",
    textContent: "Неверный логин",
  });

  const formOpenInp2 = el("div", {
    classList: "form__open-inputbox",
  });

  const labelPassword = el("label", {
    classList: "password",
    textContent: "Пароль",
  });

  const blockError2 = el("div", {
    classList: "error-label",
    textContent: "Неверный пароль",
  });

  const inputPassword = el("input", {
    classList: "form__open-input",
    name: "password",
    type: "password",
    placeholder: "Пароль",
    "data-input": "password",
  });

  const button = el("button", {
    classList: ["btn", "btn-reset", "form__open-button"],
    textContent: "Войти",
  });

  const spinner = el("div", {
    classList: "loader",
  });

  const ApiErrorBlock = el("div", {
    classList: "api-error-block",
    textContent: "Неправильный логин или пароль",
  });

  // Валидация логина и пароля

  inputLogin.addEventListener("input", (e) => {
    blockError.style.display = "none";

    if (!validator.isAlphanumeric(inputLogin.value)) {
      blockError.style.display = "block";
      inputLogin.style.border = "1px solid red";
    }
  });

  inputPassword.addEventListener("input", (e) => {
    blockError2.style.display = "none";

    if (!validator.isAlphanumeric(inputPassword.value)) {
      blockError2.style.display = "block";
      inputPassword.style.border = "1px solid red";
    }
  });

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    block.style.display = "none";
    spinner.style.display = "block";
    try {
      const token = await WorkApi.autorization(
        inputLogin.value,
        inputPassword.value
      );
      block.style.display = "block";
      ApiErrorBlock.style.display = "";
      localStorage.setItem("token", token.payload.token);

      if (token) {
        router.navigate("/accounts");
      }
    } catch {
      ApiErrorBlock.style.display = "block";
    } finally {
      spinner.style.display = "none";
    }
  });

  formOpenInp.append(labelLogin, inputLogin, blockError);
  formOpenInp2.append(labelPassword, inputPassword, blockError2);
  formOpen.append(formOpenInp, formOpenInp2, button);
  blockForm.append(formTitle, formOpen);
  blockContainer.append(blockForm);
  block.append(blockContainer, ApiErrorBlock);

  containerHeader.append(linkHeader);
  header.append(containerHeader);
  container.append(header, block, spinner);
  return container;
}
