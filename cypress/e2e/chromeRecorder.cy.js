//Used chrome extenstion Cypress Chrome Recorder
import "cypress-file-upload";

const firstNames = [
  "John",
  "Jane",
  "David",
  "Emily",
  "Michael",
  "Olivia",
  "Daniel",
  "Sophia",
  "Matthew",
  "Ava",
];
const lastNames = [
  "Wick",
  "Johnson",
  "Brown",
  "Davis",
  "Wilson",
  "Anderson",
  "Taylor",
  "Clark",
  "Walker",
  "Moore",
];

const getRandomValueFromArray = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const getRandomFirstName = () => getRandomValueFromArray(firstNames);

const getRandomLastName = () => getRandomValueFromArray(lastNames);

const getRandomPhoneNumber = () => {
  const randomNumber = Math.floor(Math.random() * 900000000) + 100000000;
  return `9${randomNumber.toString()}`;
};

const getRandomGmailAddress = () => {
  const randomString = Math.random().toString(36).substring(7);
  return `random${randomString}@gmail.com`;
};

const getRandomBirthday = () => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 28;
  const maxYear = currentYear - 17;
  const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}/${year}`;
};

Cypress.on("uncaught:exception", () => false);

describe("JohnWickTest", () => {
  it("tests JohnWickTest", () => {
    cy.viewport(1268, 937);
    cy.visit("http://localhost:8080/");
    const randomPhoneNumber = getRandomPhoneNumber();
    const randomGmailAddress = getRandomGmailAddress();
    const randomBirthday = getRandomBirthday();
    const randomFirstName = getRandomFirstName();
    const randomLastName = getRandomLastName();
    cy.get("div:nth-of-type(3) > div:nth-of-type(1) input").click();
    cy.get("div:nth-of-type(3) > div:nth-of-type(1) input").type(
      randomFirstName
    );
    cy.get("div:nth-of-type(4) > div:nth-of-type(1) input").click();
    cy.get("div:nth-of-type(4) > div:nth-of-type(1) input").type(
      randomLastName
    );
    cy.get("div:nth-of-type(2) > div.MuiBox-root").click();
    cy.get("#app > div > div:nth-of-type(2)").click();
    cy.get("div:nth-of-type(4) > div:nth-of-type(2) input").click();
    cy.get("div:nth-of-type(4) > div:nth-of-type(2) input").type(
      randomPhoneNumber
    );
    cy.get("div > div > div > div:nth-of-type(2) button").click();
    cy.get("#mui-component-select-Language").click();
    cy.get('li[data-value="en"]').click();
    // cy.contains("English").click({ force: true });  English option is covered by
    //another element, comment code only work for hindi and marathi because
    //those are not covered by other code. Tried other ways too.
    //while use force true, the drop down menu will not go away, cannot process to next step.
    //So be specific like: li[data-value="en"] so it works, en can replace with hi,mr.
    cy.get("#mui-component-select-Language").should("contain", "English");
    cy.get("div:nth-of-type(12) > button").click();
    cy.get("div:nth-of-type(11) > button").click();
    cy.get("div:nth-of-type(11) > button").click();
    cy.get("div:nth-of-type(2) > div div.MuiContainer-root").click();
    cy.get("div:nth-child(4) > div input").click();
    cy.get("div:nth-child(4) > div input").type(randomBirthday);
    cy.get("div:nth-child(7) > div input").click();
    cy.get("div:nth-child(7) > div input").type(randomGmailAddress);
    cy.get("#gender").click();
    cy.contains("Female").click(); // can replace with transgender but not male
    cy.get("#gender").should("contain", "Female"); //male is full
    // profile picture
    const fileName = "1mb.png";
    cy.fixture(fileName).then((fileContent) => {
      cy.get('[data-cy="imageInput"]').attachFile({
        fileContent,
        fileName,
        mimeType: "image/jpeg",
      });
    });
    cy.get("button:nth-child(3)").click();
    cy.get("#mui-component-select-state").click();
    cy.get("li:nth-of-type(5)").click();
    cy.get("#mui-component-select-district").click();
    cy.get("#menu-district > div.MuiBackdrop-root").click();
    cy.get("#mui-component-select-district").click();
    cy.get("li:nth-of-type(3)").click();
    cy.get("#city").click();
    cy.get("#city").type("Wash.D.C");
    cy.get("#pin_code").click();
    cy.get("#pin_code").type("456001");
    cy.get("#mui-component-select-current_status").click();
    cy.get("li:nth-of-type(4)").click();
    cy.get("#mui-component-select-qualification").click();
    cy.get("li:nth-of-type(5)").click();
    cy.get("div:nth-child(7) > div > div").click();
    cy.get("div:nth-child(7) > div > div").type("99.99");
    cy.get("div:nth-child(8) > div > div").click();
    cy.get("div:nth-child(8) > div > div").type("99.99");
    cy.get("#mui-component-select-school_medium").click();
    cy.get("li:nth-of-type(3)").click();
    cy.get("#mui-component-select-caste").click();
    cy.get("li:nth-of-type(4)").click();
    cy.get("#mui-component-select-religion").click();
    cy.get("li:nth-of-type(8)").click();
    cy.get("#mui-component-select-religion").click();
    cy.get("li:nth-of-type(7)").click();
    cy.get(
      "#app > div > div:nth-of-type(2) button.MuiButton-contained"
    ).click();
  });
});
