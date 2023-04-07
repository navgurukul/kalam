/// <reference types='Cypress' />
beforeEach(() => {
  cy.visit("http://localhost:8080/test/instructions");
});

describe("Section 2: Test Instructions", () => {
  it("should have a language dropdown with the options English, Hindi and Marathi: Verify language change", () => {
    cy.get(`[data-cy="lang-dropdown"]`).should("have.value", "");

    // open the select
    cy.get(`[data-cy="lang-dropdown"]`).click();

    // select English, verify change of language
    cy.get(`[data-cy="en"]`).click();
    cy.get('[data-cy="title"]').contains("Select Your Language");

    // select Hindin verify change of language
    cy.get(`[data-cy="hi"]`).click();
    cy.get('[data-cy="title"]').contains("अपनी भाषा चुने");

    // select Marathi, change language

    cy.get(`[data-cy="ma"]`).click();
    cy.get('[data-cy="title"]').contains("तुमची भाषा निवडा");
  });
});
