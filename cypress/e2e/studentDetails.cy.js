/// <reference types='Cypress' />
beforeEach(() => {
  cy.visit("http://localhost:8080/test/studentdetails");
});

describe("Section 3: Student Details", () => {
  // WORK IN PROGRESS / SKIPPED
  context("Profile image testing", () => {
    describe.skip("Image input", () => {
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
});
