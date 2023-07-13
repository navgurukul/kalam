/// <reference types='Cypress' />

Cypress.on("uncaught:exception", () => false);

// TODO: Make links dynamic
beforeEach(() => {
  cy.visit("http://localhost:8080/");
});

describe("Section 1: Landing page", () => {
  // TS101
  it("should display the logo top left, should redirect user to home page when logo is clicked", () => {
    // display logo top left
    cy.get('[data-cy="logo"]')
      .should("have.css", "top", "0px")
      .should("have.css", "left", "0px");

    // clicking logo should redirect user to home page
    cy.visit("http://localhost:8080/test/instructions");
    cy.get('[data-cy="logo"]').click();

    cy.url().should("equal", "http://localhost:8080/");
  });
  // TS101
  it("should have a language dropdown with the options English, Hindi and Marathi: Verify language change", () => {
    cy.get(`[data-cy="lang-dropdown"]`).should("have.value", "");

    // open the select
    cy.get(`[data-cy="lang-dropdown"]`).click();

    // select English, verify change of language
    cy.get(`[data-cy="en"]`).click();
    cy.get('[data-cy="title"]').contains("Start Admisssion Test");

    // select Hindin verify change of language
    cy.get(`[data-cy="hi"]`).click();
    cy.get('[data-cy="title"]').contains("परीक्षा शुरू करें");

    // select Marathi, change language
    cy.get("#appheader > div > div:nth-child(1) > div > div").click();
    cy.get('[data-value="ma"]').click();
    cy.get('[data-cy="title"]').contains("प्रवेश परीक्षा सुरू करा");
  });

  // TS103
  it("should type in user's first and last names, submit form and verify move to test instructions", () => {
    cy.fixture("users").then((users) => {
      const user = users[0];

      cy.get(`[data-cy="firstName-input"]`).type(user.firstName);
      cy.get(`[data-cy="lastName-input"]`).type(user.lastName);
      cy.get(`[data-cy="mobileNumber-input"]`).type(user.mobileNumber);
      cy.get(`[data-cy="submitButton"]`)
        .click()
        .url()
        .should("include", "test/instructions");
    });
  });

  // TS103_02
  it("should type in user's first and last names AND MIDDLE NAME, submit form and verify move to test instructions", () => {
    cy.fixture("users").then((users) => {
      const user = users[0];

      cy.get(`[data-cy="firstName-input"]`).type(user.firstName);
      // Middle NAME
      cy.get(`[data-cy="middleName-input"]`).type(user.middleName);

      cy.get(`[data-cy="lastName-input"]`).type(user.lastName);
      cy.get(`[data-cy="mobileNumber-input"]`).type(user.mobileNumber);
      cy.get(`[data-cy="submitButton"]`)
        .click()
        .wait(1000)
        .url()
        .should("include", "test/instructions");
    });
  });

  // TS105
  it("should submit button with invalid data, verify notification to user, URL should not change", () => {
    // get the url before submit button is clicked
    cy.url().then((urlBeforeSubmit) => {
      cy.get(`[data-cy=submitButton]`).click();

      // snackbar
      cy.get('[data-cy="error-bar"]');

      // get the url after submit button is clicked
      cy.url().then((urlAfterSubmit) => {
        // assert the URL before and after are the same
        expect(urlBeforeSubmit).to.equal(urlAfterSubmit);
      });
    });
  });

  // TS105 Submit with invalid phone number
  it("should submit button with invalid data, verify notification to user, URL should not change", () => {
    cy.fixture("users").then((users) => {
      const user = users[0];

      // get the url before submit button is clicked
      cy.url().then((urlBeforeSubmit) => {
        // enter valid inputs for, first middle and last names: Invalid # Number
        cy.get(`[data-cy="firstName-input"]`).type(user.firstName);
        cy.get(`[data-cy="middleName-input"]`).type(user.middleName);
        cy.get(`[data-cy="lastName-input"]`).type(user.lastName);

        cy.get(`[data-cy=submitButton]`).click();

        // snackbar
        cy.get('[data-cy="error-bar"]');

        // get the url after submit button is clicked
        cy.url().then((urlAfterSubmit) => {
          // assert the URL before and after are the same
          expect(urlBeforeSubmit).to.equal(urlAfterSubmit);
        });
      });
    });
  });
});
