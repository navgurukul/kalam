/// <reference types='Cypress' />
beforeEach(() => {
  cy.visit("http://localhost:8080/test/instructions");
});

// TS201
describe("Section 2: Test Instructions", () => {
  context("Language dropdown", () => {
    it("should have a language dropdown with the options English, Hindi and Marathi: Verify language change", () => {
      cy.get('[data-cy="lang-dropdown"]').should("have.value", "");

      // open the select
      cy.get('[data-cy="lang-dropdown"]').click();

      // select English, verify change of language
      cy.get('[data-cy="en"]').click();
      cy.get('[data-cy="title"]').contains("Select Your Language");

      // select Hindin verify change of language
      cy.get("#mui-component-select-Language").click();
      cy.get('li[data-value="hi"]').click();
      cy.get('[data-cy="title"]').contains("अपनी भाषा चुने");

      // select Marathi, change language
      cy.get("#mui-component-select-Language").click();
      cy.get('li[data-value="ma"]').click();
      cy.get('[data-cy="title"]').contains("तुमची भाषा निवडा");
    });
  });

  context("Next step button functionality", () => {
    it("should move to next step when (Step) button is clicked", () => {
      // Lets go ahead button
      cy.get('[data-cy="nextStepButton"]').click();
      cy.get(`[data-cy="heading`).contains("NavGurukul Entrance Test");

      // Im ready button
      cy.get('[data-cy="nextStepButton"]').click();
      cy.get('[data-cy="heading"]').contains("Read Carefully");

      // Start the text button
      cy.get('[data-cy="startTestButton"]')
        .click()
        .url()
        .should("contain", "/test/studentdetails");
    });
  });
});
