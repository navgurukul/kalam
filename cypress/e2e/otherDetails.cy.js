/// <reference types='Cypress' />

import "cypress-file-upload";

beforeEach(() => {
  cy.visit("http://localhost:8080/test/studentdetails");

  // Moving to the second page of the form for student details
  cy.fixture("users.json").then((users) => {
    const user = users[0];

    cy.get('[data-cy="firstName-input"]').type(user.firstName);
    cy.get('[data-cy="middleName-input"]').type(user.middleName);
    cy.get('[data-cy="lastName-input"]').type(user.lastName);
    cy.get('[data-cy="waInput"]').type(user.mobileNumber);
    cy.get('[data-cy="altInput"]').type(user.alternateNumber);
    cy.get("#mui-1").type(user.dob);
    cy.get('[data-cy="email-input"]').type(user.email);
    cy.get('[data-cy="genderDropdown"]').click();
    cy.get('[data-value="female"]').click();
  });

  const fileName = "test-image.jpg";
  cy.fixture(fileName).then((fileContent) => {
    cy.get('[data-cy="imageInput"]').attachFile({
      fileContent,
      fileName,
      mimeType: "image/jpeg",
    });
  });
  cy.get('form > .MuiPaper-root > [tabindex="0"]').click();

  cy.get('[data-cy="cityInput"]').as("cityInput");
  cy.get('[data-cy="pinInput"]').as("pinCodeDropdown");
  cy.get('[data-cy="districtInput"]').as("districtDropdown");
  cy.get('[data-cy="stateInput"]').as("stateSelectDropdown");
  cy.get('[data-cy="currentStatus"]').as("currentStatusDropdown");
  cy.get('[data-cy="maxQualification"]').as("maximumQualificationLabel");
  cy.get('[data-cy="schoolMedium"]').as("schoolMediumDropdown");
  cy.get('[data-cy="religionInput"]').as("religionDropdown");
  cy.get(".MuiMobileStepper-root > .MuiButton-contained").as("submitButton");
});

describe("Section 3: Other details", () => {
  it("Form validation for other details page", () => {
    cy.get(".MuiContainer-maxWidthSm > .MuiTypography-root").contains(
      "Other Details"
    );
  });
});
