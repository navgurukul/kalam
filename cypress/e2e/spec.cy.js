/// <reference types='Cypress' />
beforeEach(() => {
  cy.visit("http://localhost:8080/");
});

describe("Section 1: Landing page", () => {
  it("should display the logo top left", () => {
    cy.get('[data-cy="logo"]')
      .should("have.css", "top", "0px")
      .should("have.css", "left", "0px");
  });
  it("should redirect user to home page when logo is clicked", () => {
    cy.visit("http://localhost:8080/test/instructions");
    cy.get('[data-cy="logo"]').click();
    cy.url().should("equal", "http://localhost:8080/");
  });
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

    cy.get(`[data-cy="ma"]`).click();
    cy.get('[data-cy="title"]').contains("प्रवेश परीक्षा सुरू करा");
  });
});
