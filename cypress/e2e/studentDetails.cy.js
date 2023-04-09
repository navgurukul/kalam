/// <reference types='Cypress' />
beforeEach(() => {
  cy.visit("http://localhost:8080/test/studentdetails");

  // Inputs
  cy.get(`[data-cy="firstName-input"]`).as("firstNameInput");
  cy.get(`[data-cy="middleName-input"]`).as("middleNameInput");
  cy.get(`[data-cy="lastName-input"]`).as("lastNameInput");
  cy.get(`[data-cy="email-input"]`).as("emailInput");
  cy.get('form > .MuiPaper-root > [tabindex="0"]').as("nextButton");

  // Input feedback
  cy.get("#FirstName-helper-text").as("firstNameFeedback");
  cy.get("#MiddleName-helper-text").as("middleNameFeedback");
  cy.get("#LastName-helper-text").as("lastNameFeedback");
  cy.get("#FirstName-helper-text").as("numberFeedback");
});

describe("Section 3: Student Details", () => {
  // WORK IN PROGRESS / SKIPPED
  context.skip("Profile image testing", () => {
    describe("Image input", () => {
      it("should allow the user to input an image", () => {
        cy.get('[data-cy="imageInput"]').then((input) => {
          cy.fixture("test-image.jpg", "base64").then((fileContent) => {
            const file = Cypress.Blob.base64StringToBlob(fileContent);
            const testFile = new File([file], "test-image.jpg", {
              type: "image/jpeg",
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(testFile);
            input[0].files = dataTransfer.files;
            cy.get(`[data-cy="avatarImg"]`).should(
              "have.attr",
              "src",
              `${URL.createObjectURL}`
            );
          });
        });
      });
    });
  });

  context.only("Form validation testing", () => {
    describe("Verify fist name, last name, & email fields", () => {
      it("should verify the first name, last name & email fields with valid inputs", () => {
        cy.fixture("users.json").then((users) => {
          const user = users[0];

          cy.get(`@firstNameInput`).type(user.firstName);
          cy.get(`@lastNameInput`).type(user.lastName);
          cy.get(`@emailInput`).type(user.email);
          cy.get("@nextButton").click();

          // Check if input is valid by checking the text value
          cy.get(`@firstNameFeedback`).should("not.have.class", "Mui-error");
          cy.get(`@lastNameInput`).should("not.have.class", "Mui-error");
          cy.get(`@emailInput`).should("not.have.class", "Mui-error");
        });
      });
    });
  });
});
