/// <reference types='Cypress' />

it("should not create a duplicate user and register a call", () => {
  // Stubbing the request to the check_duplicate API endpoint.
  cy.intercept("GET", "https://dev-join.navgurukul.org/api/check_duplicate", {
    statusCode: 200,
    body: { data: { alreadyGivenTest: false } },
  }).as("checkDuplicate");

  // Stubbing the request to the register_exotel_call API endpoint.
  cy.intercept(
    "GET",
    "https://dev-join.navgurukul.org/api/helpline/register_exotel_call",
    {
      statusCode: 200,
      body: { success: true, key: "US0A8X" },
    }
  ).as("registerCall");

  cy.visit("/http://localhost:8080/"); // replace this with the correct route

  // Fill out the form and submit it.
  cy.get('[data-cy="firstName-input"]').type("Louis");
  cy.get('[data-cy="lastName-input"]').type("Catala");
  cy.get('[data-cy="mobileNumber-input"]').type("9999999999");
  cy.get('[data-cy="submitButton"]').click();

  // Wait for the stubbed requests to be made.
  cy.wait("@checkDuplicate");
  cy.wait("@registerCall");

  // Now you can assert that the correct things happened in the UI.
  // Here, we're assuming that a success message is displayed when the requests are successful.
  // replace this with the correct selector for the success message
  cy.url().should("include", "/test/instructions");
});
