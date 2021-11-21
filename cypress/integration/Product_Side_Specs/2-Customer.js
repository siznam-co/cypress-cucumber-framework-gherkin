/// <reference types="Cypress" />
import { getUniqueName } from "../../support/commands.js"

const customerLocators = require("../../Locators/CustomerLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

describe("Add new Customer and add users to it.", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Lists").click()
        cy.get(commonLocators.subMenuBtn).contains("Customers").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Customers")
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Add new Customer.", () => {
        cy.get(customerLocators.addCustomerBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "New Customer")

        cy.fixture("Customer_data").then(data => {
            cy.enterUniqueName(customerLocators.creates.customerName_UNIQUE, data.creates.customerName_UNIQUE)
            cy.get(customerLocators.creates.customerId).type(window.uniqueId) // Defined in Commands.js
            cy.get(customerLocators.creates.vatNumber).type(data.creates.vatNumber + window.uniqueId) // Defined in Commands.js
            cy.get(customerLocators.creates.address).type(data.creates.address)
            cy.get(customerLocators.creates.city).type(data.creates.city)
            cy.get(customerLocators.creates.postalCode).type(data.creates.postalCode)
            cy.get(customerLocators.creates.phone).type(data.creates.phone)
            cy.enterUniqueEmail(customerLocators.creates.customerEmail_UNIQUE, data.creates.customerEmail_UNIQUE)
            cy.get(customerLocators.creates.website).type(data.creates.website)
            cy.get(customerLocators.creates.notes).type(data.creates.notes)
            cy.get(customerLocators.creates.saveBtn).click()

            cy.wait("@createCustomer").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "Customer Details")

            cy.readUniqueName(customerLocators.details.customerName_UNIQUE, data.creates.customerName_UNIQUE)
            cy.get(customerLocators.details.customerId).should("have.text", window.uniqueId) // Defined in Commands.js
            cy.get(customerLocators.details.addressAndCity).should("have.text", data.creates.address + ", " + data.creates.city)
            cy.get(customerLocators.details.phone).should("have.text", data.creates.phone)
            cy.get(customerLocators.details.website).should("have.text", data.creates.website)
            cy.readUniqueEmail(customerLocators.details.customerEmail_UNIQUE, data.creates.customerEmail_UNIQUE)
            cy.get(customerLocators.details.postalCode).should("have.text", "Postal Code: " + data.creates.postalCode)
            cy.get(customerLocators.details.notes).should("have.text", data.creates.notes)

            cy.assertCustomer(getUniqueName(data.creates.customerName_UNIQUE), 1)

        })
    })

    it("Edit new Customer.", () => {
        cy.get(customerLocators.editBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "Edit Customer")

        cy.fixture("Customer_data").then(data => {
            cy.get(customerLocators.creates.customerName_UNIQUE).type(" up")
            cy.get(customerLocators.creates.customerId).type(" up")
            cy.get(customerLocators.creates.vatNumber).type(" up")
            cy.get(customerLocators.creates.address).type(" up")
            cy.get(customerLocators.creates.city).type(" up")
            cy.get(customerLocators.creates.postalCode).type("9")
            cy.get(customerLocators.creates.phone).type("2")
            cy.get(customerLocators.creates.customerEmail_UNIQUE).type("up")
            cy.get(customerLocators.creates.website).type("up")
            cy.get(customerLocators.creates.notes).type(" up")
            cy.get(customerLocators.creates.saveBtn).click()

            cy.wait("@updateCustomer").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "Customer Details")

            cy.get(customerLocators.details.customerName_UNIQUE).should("have.text", getUniqueName(data.creates.customerName_UNIQUE) + " up")
            cy.get(customerLocators.details.customerId).should("have.text", window.uniqueId + " up") // Defined in Commands.js
            cy.get(customerLocators.details.addressAndCity).should("have.text", data.creates.address + " up" + ", " + data.creates.city + " up")
            cy.get(customerLocators.details.phone).should("have.text", data.creates.phone + "2")
            cy.get(customerLocators.details.website).should("have.text", data.creates.website + "up")
            cy.readUniqueEmail(customerLocators.details.customerEmail_UNIQUE, data.creates.customerEmail_UNIQUE + "up")
            cy.get(customerLocators.details.postalCode).should("have.text", "Postal Code: " + data.creates.postalCode + "9")
            cy.get(customerLocators.details.notes).should("have.text", data.creates.notes + " up")

            cy.assertCustomer(getUniqueName(data.creates.customerName_UNIQUE) + " up", 1)

        })
    })

    it("Archive and delete the created Customer.", () => {
        cy.get(customerLocators.archiveBtn).click()
        cy.get(customerLocators.modalConfrimBtn).click()

        cy.get(customerLocators.deleteBtn).click()
        cy.get(customerLocators.modalConfrimBtn).click()

        cy.wait("@deleteCustomer").its("response.statusCode").should("eq", 204)

        // Search and check if the Customer still exists or deleted properly.
        cy.fixture("Customer_data").then(data => {
            cy.assertCustomer(getUniqueName(data.creates.customerName_UNIQUE), 0)
        })

    })
})