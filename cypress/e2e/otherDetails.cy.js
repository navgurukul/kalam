/// <reference types='Cypress' />

import "cypress-file-upload";

beforeEach(() => {

  cy.visit("http://localhost:8080/test/studentdetails");

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
  

  // Inputs
  cy.get('[data-cy="city"]').as("cityInput");
  cy.get('[data-cy="pin-Input"]').as("pinCodeDropdown");
  cy.get('[data-cy="district-input"]').as("districtDropdown");
  cy.get('[data-cy="state-input"]').as("stateSelectDropdown");
  cy.get('[data-cy="currentStatus"]').as("currentStatusDropdown");
  cy.get('[data-cy="maxQualification"]').as("maximumQualificationLabel");
  cy.get('[data-cy="schoolMedium"]').as("schoolMediumDropdown");
  cy.get('[data-cy="religion-input"]').as("religionDropdown");
});
describe("TS307_01_State_District_Dropdown", () => {
  it.only("District Dropdown should be populated based on state selected ", () => {
    cy.get("@stateSelectDropdown").click();
    cy.get('[data-value="BR"]').click();
    cy.get('@districtDropdown').click();
    cy.get('[data-value="Arrah"]').click();
    cy.get('@districtDropdown').click();
    cy.get('[data-value="Sheikhpura"]').click();
    cy.get('@districtDropdown').click();
    cy.get('[data-value="Maharajgani"]').click();
    cy.get('@districtDropdown').click();
    cy.get('[data-value="Thakurganj"]').click();
  });
});
