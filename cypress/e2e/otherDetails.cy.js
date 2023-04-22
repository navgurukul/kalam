/// <reference types='Cypress' />

import "cypress-file-upload";

beforeEach(() => {
  cy.visit("http://localhost:8080/test/studentdetails");

  // Inputs
  cy.get('[data-cy="firstName-input"]').as("firstNameInput");
  cy.get('[data-cy="middleName-input"]').as("middleNameInput");
  cy.get('[data-cy="lastName-input"]').as("lastNameInput");
  cy.get('[data-cy="email-input"]').as("emailInput");
  cy.get('form > .MuiPaper-root > [tabindex="0"]').as("nextButton");
  cy.get("#mui-1").as("dobDatePicker");
  cy.get('[data-cy="waInput"]').as("whatsAppNumberInput");
  cy.get('[data-cy="altInput"]').as("alternateNumberInput");
  cy.get('[data-cy="genderDropdown"]').as("genderDropdown");

  cy.fixture("users.json").then((users) => {
    const user = users[0];

    cy.get("@firstNameInput").type(user.firstName);
    cy.get("@middleNameInput").type(user.middleName);
    cy.get("@lastNameInput").type(user.lastName);
    cy.get("@whatsAppNumberInput").type(user.mobileNumber);
    cy.get("@alternateNumberInput").type(user.alternateNumber);
    
    cy.get("@dobDatePicker").type(user.dob);
    cy.get("@emailInput").type(user.email);
    cy.get("@genderDropdown").click();
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
  cy.get("@nextButton").click();
});

describe("Section 3: Other details", () => {
  it("Form validation for other details page", () => {
    cy.get('[data-cy="city"]').as("cityInput");
    cy.get('[data-cy="Pin-input"]').as("pinCodeDropdown");
    cy.get('[data-cy="district-input"]').as("districtDropdown");
    cy.get('[data-cy="state-input"]').as("stateSelectDropdown");
    cy.get('[data-cy="currentStatus"]').as("currentStatusDropdown");
    cy.get('[data-cy="maxQualification"]').as("maximumQualificationLabel");
    cy.get('[data-cy="maxQualification"]').as("maximumQualificationLabel");
    cy.get('[data-cy="schoolMedium"]').as("schoolMediumDropdown");
    cy.get('[data-cy="religion-input"]').as("religionDropdown");
  });
});
