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
  it("District Dropdown should be populated based on state selected ", () => {
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

describe("TS307_02_State_District_Dropdown",() => {
  it.only("select a blank state and the page should prompt the user with an error message", () => {
    cy.get("@cityInput").type("SLC");
    cy.get("@pinCodeDropdown").type("440212");
    cy.get("@currentStatusDropdown").click();
    cy.get('[data-value="job"]').click();
    cy.get("@maximumQualificationLabel").click();
    cy.get('[data-value="class10th"]').click();
    cy.get('#mui-3').type("50")
    cy.get("@schoolMediumDropdown").click();
    cy.get('[data-value="en"]').click();
    cy.get('#mui-component-select-caste').click();
    cy.get('[data-value="scSt"]').click()
    cy.get('#mui-component-select-religion').click();
    cy.get('[data-value="others"]').click();
    cy.get('.MuiMobileStepper-root > .MuiButton-contained').click();
    cy.get('.MuiGrid-container > :nth-child(1) > .MuiTypography-root').should('be.visible').and('contain.text', 'Select your State')
  });
});

describe("TS308_01_City_PIN",() => {
  it("Should validate if website recognizes/invalid city and pin inputs", () => {
    cy.get('@pinCodeDropdown')
      .find('input') 
      .type('121212');
    cy.get('#pin_code-helper-text').should('be.visible').and('contain.text', 'Ex. 4402xx');
    cy.get("@cityInput")
    .click()
    .type("Salt Lake City");
    cy.get('#city-helper-text').should('be.visible').and('contain.text', 'Ex. Bangalore')

  
    cy.reload();
    cy.wait(5000);
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
      cy.get('form > .MuiPaper-root > [tabindex="0"]').click()

    });
    cy.get("@cityInput").type("Salt Lake City");
    cy.get("@pinCodeDropdown").type("Gustavo");
    cy.get('#pin_code-helper-text').should('be.visible').and('contain.text', 'Enter a valid Pin Code');
    cy.get('@pinCodeDropdown')
      .find('input') 
      .clear()
      .type('1212125');
      cy.get('#pin_code-helper-text').should('be.visible').and('contain.text', 'Enter a valid Pin Code');

    cy.get("@cityInput")
      .clear()
      .type("Gustavo");
    cy.get("@pinCodeDropdown")
      .clear()
      .type("123456");
    cy.get("@stateSelectDropdown").click();
    cy.get('#pin_code-helper-text').should('be.visible').and('contain.text', 'Ex. 4402xx');
    cy.get('#city-helper-text').should('be.visible').and('contain.text', 'Error')
  });
});
