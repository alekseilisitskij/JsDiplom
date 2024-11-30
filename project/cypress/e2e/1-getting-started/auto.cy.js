describe("Login", function () {
  it("Sing in", function () {
    cy.visit("http://localhost:5173/");
    // Не правильный пароль
    cy.get('input[name="name"]').type("developer");
    cy.get('input[name="password"]').type("skilbox");
    // ВводимПравильный пароль
    cy.get('input[name="name"]').clear().type("developer");
    cy.get('input[name="password"]').clear().type("skillbox");
    cy.get(".form__open-button").click();
    // Находим определенный блок
    cy.get(".accounts__item")
      .contains("74213041477477406320783754")
      .parents(".accounts__item") // Поднимаемся к родительскому элементу, если нужно
      .find("button") // Ищем кнопку внутри этого блока (замените 'button' на правильный селектор)
      .click(); // Кликаем по найденной кнопке;
    // Отправить на другой счет
    cy.get('input[name="translation"]').type("32005406460111107525450575");
    cy.get('input[name="amount"]').type("100");
    cy.get(".translation__btn").click();

    cy.get(".hero__btn").click();
  });
});
