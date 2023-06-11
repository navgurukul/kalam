/// <reference types='Cypress' />

Cypress.on("uncaught:exception", () => false);

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

  // Input feedback
  cy.get("#FirstName-helper-text").as("firstNameFeedback");
  cy.get("#MiddleName-helper-text").as("middleNameFeedback");
  cy.get("#LastName-helper-text").as("lastNameFeedback");
  cy.get("#FirstName-helper-text").as("numberFeedback");
  cy.get("#mui-2-helper-text").as("emailFeedback");
  cy.get("#mui-1-helper-text").as("dobFeedback");
  cy.get("#whatsapp-helper-text").as("whatsAppNumFeedback");
  cy.get("#AlternateNumber-helper-text").as("altNumberFeedback");
});

describe("Section 3: Basic Details", () => {
  context("Form validation testing", () => {
    describe("Verify error feedback", () => {
      it("should verify the first name, last name & email fields with invalid inputs", () => {
        // Submit form (No input)
        cy.get("@nextButton").click();
        cy.get("@firstNameFeedback").contains("Enter First Name");
        cy.get("@lastNameFeedback").contains("Enter Last Name");
        cy.get("@emailFeedback").contains("Enter Email");
      });
      it("Should verify an invalid email", () => {
        cy.get("@emailInput").type("invalid#gmail.com");
        cy.get("@nextButton").click();

        cy.get("@emailInput").contains("Enter Valid Email");
      });
    });
    describe("Verify fist name, last name, & email fields", () => {
      it("should verify the first name, last name & email fields with valid inputs", () => {
        cy.fixture("users.json").then((users) => {
          const user = users[0];

          cy.get("@firstNameInput").type(user.firstName);
          cy.get("@lastNameInput").type(user.lastName);
          cy.get("@emailInput").type(user.email);
          // Submit form
          cy.get("@nextButton").click();

          // Check if input is valid by checking the text value
          cy.get("@firstNameInput").should("not.have.class", "Mui-error");
          cy.get("@lastNameInput").should("not.have.class", "Mui-error");
          cy.get("@emailInput").should("not.have.class", "Mui-error");
        });
      });
    });
    describe("Verify the datepicker", () => {
      it("Should verify the user age is between 17 & 28 years", () => {
        // Invalid age lower than 17
        cy.get("@dobDatePicker").click().type("10/13/2006");
        cy.get("@nextButton").click();
        cy.get("@dobFeedback").should("have.class", "Mui-error");

        // valid age between 17-28 years
        cy.get("@dobDatePicker").click().clear().type("10/13/2005");
        cy.get("@nextButton").click();
        cy.get("@dobFeedback").should("not.have.class", "Mui-error");

        // Invalid age higher than 28 years
        cy.get("@dobDatePicker").click().clear().type("10/13/1993");
        cy.get("@nextButton").click();
        cy.get("@dobFeedback").should("have.class", "Mui-error");
      });
    });
    describe("Verify Whatsapp and alternate number input fields", () => {
      it("Should verify the number field validations are working", () => {
        cy.fixture("users.json").then((users) => {
          const user = users[0];
          // Valid inputs
          cy.get("@whatsAppNumberInput").type(user.mobileNumber);
          cy.get("@nextButton").click();
          cy.get("@whatsAppNumFeedback").should("not.have.class", "Mui-error");

          cy.get("@alternateNumberInput").type(user.alternateNumber);
          cy.get("@nextButton").click();
          cy.get("@altNumberFeedback").should("not.have.class", "Mui-error");

          // Invalid inputs shorter than 10 digits
          cy.get("@whatsAppNumberInput").clear().type("1");
          cy.get("@nextButton").click();
          cy.get("@whatsAppNumFeedback").should("have.class", "Mui-error");

          cy.get("@alternateNumberInput").clear().type("1");
          cy.get("@nextButton").click();
          cy.get("@altNumberFeedback").should("have.class", "Mui-error");

          // Invalid inputs greater than 10 digits
          cy.get("@whatsAppNumberInput").clear().type(`${user.mobileNumber}1`);
          cy.get("@nextButton").click();
          cy.get("@whatsAppNumFeedback").should("have.class", "Mui-error");

          cy.get("@alternateNumberInput")
            .clear()
            .type(`${user.alternateNumber}1`);
          cy.get("@nextButton").click();
          cy.get("@altNumberFeedback").should("have.class", "Mui-error");
        });
      });
    });
    describe("Verify gender dropdown functionality", () => {
      it("Should verify that an empty gender dropdown does not allow the use of nextButton", () => {
        cy.get("@nextButton").click();
        cy.get('[data-cy="genderFeedback"]').contains(
          "Please specify your gender"
        );
      });
      it("Should verify the functionality of the gender dropdown", () => {
        cy.get("@genderDropdown").should("have.value", "");

        // male dropdown input
        cy.get("@genderDropdown").click();
        cy.get('[data-value="male"]').click();
        cy.get("@genderDropdown")
          .find(">input")
          .should("have.attr", "value", "male");

        // female dropdown input
        cy.get("@genderDropdown").click();
        cy.get('[data-value="female"]').click();
        cy.get("@genderDropdown")
          .find(">input")
          .should("have.attr", "value", "female");

        // transgender dropdown input
        cy.get("@genderDropdown").click();
        cy.get('[data-value="trans"]').click();
        cy.get("@genderDropdown")
          .find(">input")
          .should("have.attr", "value", "trans");
      });
    });
  });
});
