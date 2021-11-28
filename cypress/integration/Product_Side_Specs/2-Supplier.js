/// <reference types="Cypress" />
import { getUniqueName } from "../../support/commands.js"

const supplierLocators = require("../../Locators/SupplierLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

describe("Add new Supplier and add users to it.", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Lists").click()
        cy.get(commonLocators.subMenuBtn).contains("Suppliers").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Suppliers")
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Add new Supplier.", () => {
        cy.get(supplierLocators.addSupplierBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "New Supplier")

        cy.fixture("Supplier_data").then(data => {
            cy.enterUniqueName(supplierLocators.creates.supplierName_UNIQUE, data.creates.supplierName_UNIQUE)
            cy.get(supplierLocators.creates.supplierId).type(window.uniqueId) // Defined in Commands.js
            cy.get(supplierLocators.creates.vatNumber).type(data.creates.vatNumber + window.uniqueId) // Defined in Commands.js
            cy.get(supplierLocators.creates.address).type(data.creates.address)
            cy.get(supplierLocators.creates.city).type(data.creates.city)
            cy.get(supplierLocators.creates.postalCode).type(data.creates.postalCode)
            cy.get(supplierLocators.creates.phone).type(data.creates.phone)
            cy.enterUniqueEmail(supplierLocators.creates.supplierEmail_UNIQUE, data.creates.supplierEmail_UNIQUE)
            cy.get(supplierLocators.creates.website).type(data.creates.website)
            cy.get(supplierLocators.creates.notes).type(data.creates.notes)
            cy.get(supplierLocators.creates.saveBtn).click()

            cy.wait("@createSupplier").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "Supplier Details")

            cy.readUniqueName(supplierLocators.details.supplierName_UNIQUE, data.creates.supplierName_UNIQUE)
            cy.get(supplierLocators.details.supplierId).should("have.text", window.uniqueId) // Defined in Commands.js
            cy.get(supplierLocators.details.addressAndCity).should("have.text", data.creates.address + ", " + data.creates.city)
            cy.get(supplierLocators.details.phone).should("have.text", data.creates.phone)
            cy.get(supplierLocators.details.website).should("have.text", data.creates.website)
            cy.readUniqueEmail(supplierLocators.details.supplierEmail_UNIQUE, data.creates.supplierEmail_UNIQUE)
            cy.get(supplierLocators.details.postalCode).should("have.text", "Postal Code: " + data.creates.postalCode)
            cy.get(supplierLocators.details.notes).should("have.text", data.creates.notes)

            cy.assertSupplier(getUniqueName(data.creates.supplierName_UNIQUE), 1)

        })
    })

    it("Edit new Supplier.", () => {
        cy.get(supplierLocators.editBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "Edit Supplier")

        cy.fixture("Supplier_data").then(data => {
            cy.get(supplierLocators.creates.supplierName_UNIQUE).type(" up")
            cy.get(supplierLocators.creates.supplierId).type(" up")
            cy.get(supplierLocators.creates.vatNumber).type(" up")
            cy.get(supplierLocators.creates.address).type(" up")
            cy.get(supplierLocators.creates.city).type(" up")
            cy.get(supplierLocators.creates.postalCode).type("9")
            cy.get(supplierLocators.creates.phone).type("2")
            cy.get(supplierLocators.creates.supplierEmail_UNIQUE).type("up")
            cy.get(supplierLocators.creates.website).type("up")
            cy.get(supplierLocators.creates.notes).type(" up")
            cy.get(supplierLocators.creates.saveBtn).click()

            cy.wait("@updateSupplier").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "Supplier Details")

            cy.get(supplierLocators.details.supplierName_UNIQUE).should("have.text", getUniqueName(data.creates.supplierName_UNIQUE) + " up")
            cy.get(supplierLocators.details.supplierId).should("have.text", window.uniqueId + " up") // Defined in Commands.js
            cy.get(supplierLocators.details.addressAndCity).should("have.text", data.creates.address + " up" + ", " + data.creates.city + " up")
            cy.get(supplierLocators.details.phone).should("have.text", data.creates.phone + "2")
            cy.get(supplierLocators.details.website).should("have.text", data.creates.website + "up")
            cy.readUniqueEmail(supplierLocators.details.supplierEmail_UNIQUE, data.creates.supplierEmail_UNIQUE + "up")
            cy.get(supplierLocators.details.postalCode).should("have.text", "Postal Code: " + data.creates.postalCode + "9")
            cy.get(supplierLocators.details.notes).should("have.text", data.creates.notes + " up")

            cy.assertSupplier(getUniqueName(data.creates.supplierName_UNIQUE) + " up", 1)
        })
    })

    it("Archive and delete the created Supplier.", () => {
        cy.get(supplierLocators.archiveBtn).click()
        cy.get(supplierLocators.modalConfrimBtn).click()

        cy.get(supplierLocators.deleteBtn).click()
        cy.get(supplierLocators.modalConfrimBtn).click()

        cy.wait("@deleteSupplier").its("response.statusCode").should("eq", 204)

        // Search and check if the Supplier still exists or deleted properly.
        cy.fixture("Supplier_data").then(data => {
            cy.assertSupplier(getUniqueName(data.creates.supplierName_UNIQUE), 0)
        })

    })
})