/// <reference types='Cypress' />

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
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
};


beforeEach(() => {
  cy.visit("http://localhost:8080/test/studentdetails");

  // Inputs
  cy.get('[data-cy="firstName-input"]').as("firstNameInput");
  cy.get('[data-cy="middleName-input"]').as("middleNameInput");
  cy.get('[data-cy="lastName-input"]').as("lastNameInput");
  cy.get("#mui-1").as("dobDatePicker");
  cy.get('[data-cy="email-input"]').as("emailInput");
  cy.get('[data-cy="waInput"]').as("whatsAppNumberInput");
  cy.get('[data-cy="altInput"]').as("alternateNumberInput");
  cy.get('[data-cy="genderDropdown"]').as("genderDropdown");
});


describe("Stub tests for Registration", () => {
  context("LandingPage", () => {
    it("should not create a duplicate user and register a call", () => {
      // Stubbing the request to the check_duplicate API endpoint.
      cy.intercept("GET", "https://dev-join.navgurukul.org/api/check_duplicate*", {
        statusCode: 200,
        body: { data: { alreadyGivenTest: false } },
      }).as("checkDuplicate");

      // Stubbing the request to the register_exotel_call API endpoint.
      cy.intercept(
        "GET",
        "https://dev-join.navgurukul.org/api/helpline/register_exotel_call*",
        {
          statusCode: 200,
          body: { success: true, key: "7HZP14" },
        }
      ).as("registerCall");

      cy.visit("http://localhost:8080/");

      // Fill out the form and submit it.
      cy.get("@firstNameInput").type(getRandomFirstName());
      cy.get("@lastNameInput").type(getRandomLastName());
      cy.get('[data-cy="mobileNumber-input"]').type(getRandomPhoneNumber());
      cy.get('[data-cy="submitButton"]').click();

      // Wait for the stubbed requests to be made.
      cy.wait("@checkDuplicate");
      cy.wait("@registerCall");

      // Now you can assert that the correct things happened in the UI.
      // Here, we're assuming that a success message is displayed when the requests are successful.
      // replace this with the correct selector for the success message
      cy.url().should("include", "/test/instructions");
    });

    describe("stub studentDetails Page", () => {
      it("Basic Deatils + Other details page", () => {

        // Stubbing the request to the check_duplicate API endpoint.
        cy.intercept("POST", "https://dev-join.navgurukul.org/api/on_assessment/details/photo/7HZP14", {
          statusCode: 200,
          body: "1",
        }).as("studentBasicDetails");
        cy.intercept("GET", "https://api.countrystatecity.in/v1/countries/IN/states/AS/cities", {
          statusCode:200,
          body: [{"id":57585,"name":"Abhayapuri"},{"id":57679,"name":"Amguri"},{"id":57787,"name":"Badarpur"},{"id":57820,"name":"Baksa"},{"id":57883,"name":"Barpathar"},{"id":57884,"name":"Barpeta"},{"id":57885,"name":"Barpeta Road"},{"id":58028,"name":"Bihpuriagaon"},{"id":58034,"name":"Bijni"},{"id":58053,"name":"Bilasipara"},{"id":58075,"name":"Bokajan"},{"id":58077,"name":"Bokakhat"},{"id":58081,"name":"Bongaigaon"},{"id":58150,"name":"Basugaon"},{"id":131568,"name":"Chirang"},{"id":131588,"name":"Chabua"},{"id":131604,"name":"Chapar"},{"id":131634,"name":"Cachar"},{"id":131657,"name":"Darrang"},{"id":131695,"name":"Dergaon"},{"id":131732,"name":"Dhekiajuli"},{"id":131733,"name":"Dhemaji"},{"id":131737,"name":"Dhing"},{"id":131744,"name":"Dhubri"},{"id":131762,"name":"Dibrugarh"},{"id":131766,"name":"Digboi"},{"id":131770,"name":"Dima Hasao District"},{"id":131776,"name":"Diphu"},{"id":131778,"name":"Dispur"},{"id":131795,"name":"Duliagaon"},{"id":131796,"name":"Dum Duma"},{"id":131928,"name":"Gauripur"},{"id":131967,"name":"Gohpur"},{"id":131976,"name":"Golaghat"},{"id":131977,"name":"Golakganj"},{"id":131997,"name":"Goshaingaon"},{"id":132004,"name":"Goalpara"},{"id":132039,"name":"Guwahati"},{"id":132055,"name":"Hailakandi"},{"id":132110,"name":"Hojai"},{"id":132126,"name":"Howli"},{"id":132134,"name":"Haflong"},{"id":132137,"name":"Hajo"},{"id":132291,"name":"Jogighopa"},{"id":132294,"name":"Jorhat"},{"id":132366,"name":"Kamrup Metropolitan"},{"id":132402,"name":"Karimganj"},{"id":132518,"name":"Kharupatia"},{"id":132551,"name":"Kokrajhar"},{"id":132693,"name":"Kamrup"},{"id":132718,"name":"Karbi Anglong"},{"id":132742,"name":"Lakhimpur"},{"id":132743,"name":"Lakhipur"},{"id":132786,"name":"Lumding Railway Colony"},{"id":132793,"name":"Lala"},{"id":132842,"name":"Mahur"},{"id":132853,"name":"Maibong"},{"id":132904,"name":"Mangaldai"},{"id":132937,"name":"Mariani"},{"id":132995,"name":"Morigaon"},{"id":133002,"name":"Moranha"},{"id":133064,"name":"Makum"},{"id":133110,"name":"Nagaon"},{"id":133122,"name":"Nahorkatiya"},{"id":133130,"name":"Nalbari"},{"id":133239,"name":"North Guwahati"},{"id":133240,"name":"North Lakhimpur"},{"id":133248,"name":"Numaligarh"},{"id":133266,"name":"Namrup"},{"id":133284,"name":"Nazira"},{"id":133341,"name":"Palasbari"},{"id":133584,"name":"Raha"},{"id":133608,"name":"Rangia"},{"id":133610,"name":"Rangapara"},{"id":133798,"name":"Sapatgram"},{"id":133809,"name":"Sarupathar"},{"id":133916,"name":"Sibsagar"},{"id":133934,"name":"Silapathar"},{"id":133935,"name":"Silchar"},{"id":133979,"name":"Soalkuchi"},{"id":133996,"name":"Sonitpur"},{"id":133998,"name":"Sonari"},{"id":134003,"name":"Sorbhog"},{"id":134134,"name":"Tezpur"},{"id":134175,"name":"Tinsukia"},{"id":134203,"name":"Titabar"},{"id":134252,"name":"Udalguri"}],
        }).as("getCities")
        cy.intercept("POST", "https://dev-join.navgurukul.org/api/on_assessment/details/7HZP14", {
          statusCode: 200,
          body: {
            "sucess": true,
            "details": {
              "pin_code": "456001",
              "city": "Wash.D.C",
            }
          },
        }).as("successful");
        cy.visit("http://localhost:8080/test/studentdetails");
        
        // Fill out the form and submit it.
        const fileName = "1mb.png";
        cy.fixture(fileName).then((fileContent) => {
          cy.get('[data-cy="imageInput"]').attachFile({
            fileContent,
            fileName,
            mimeType: "image/jpeg",
          });
        });
        localStorage.setItem("enrollmentKey", "37485a503134");
        cy.get("@firstNameInput").type(getRandomFirstName());
        cy.get("@lastNameInput").type(getRandomLastName());
        cy.get("@dobDatePicker").click().type(getRandomBirthday());
        cy.get("@emailInput").type(getRandomGmailAddress());
        cy.get("@whatsAppNumberInput").type(getRandomPhoneNumber());
        cy.get("@alternateNumberInput").type(getRandomPhoneNumber());
        cy.get("@genderDropdown").click();
        cy.get('[data-value="female"]').click();
        cy.get("button:nth-child(3)").click();
        // Wait for the stubbed requests to be made.
        cy.wait("@studentBasicDetails");

        // Now you can assert that the correct things happened in the UI.
        // Here, we're assuming that a success message is displayed when the requests are successful.
        // replace this with the correct selector for the success message
        cy.get("#mui-component-select-district").should('be.visible');
        //process to next page
        
        // Fill out the form and submit it.
        cy.get("#mui-component-select-state").click();
        cy.get("li:nth-of-type(5)").click();
        cy.get("#mui-component-select-district").click();
        cy.wait("@getCities")
        cy.get("#menu-district > div.MuiBackdrop-root").click({force: true});
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
        // Wait for the stubbed requests to be made
        cy.wait("@successful")
        // Now you can assert that the correct things happened in the UI.
        // Here, we're assuming that a success message is displayed when the requests are successful.
        // replace this with the correct selector for the success message
        cy.url().should("include", "/test/finalinstruction");
      });
    });
  });
});
