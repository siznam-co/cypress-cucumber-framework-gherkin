/// <reference types="Cypress" />
import { getUniqueName } from "../../support/commands.js"

const ItemsLocators = require("../../Locators/ItemsLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

describe("Add new Items and add users to it.", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Lists").click()
        cy.get(commonLocators.subMenuBtn).contains("Items").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Item Catalog")
        cy.wait("@searchItems").its("response.statusCode").should("eq", 200)
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Add new Item.", () => {
        cy.get(ItemsLocators.addItemBtn).click()
        cy.get(commonLocators.modalHeading).should("contain", "New Item")

        cy.fixture("Items_data").then(data => {
            cy.enterUniqueName(ItemsLocators.creates.itemName_UNIQUE, data.creates.itemName_UNIQUE)
            cy.selectFromInputDropdown(ItemsLocators.creates.itemTypeDropdown, data.creates.itemTypeDropdown)
            cy.get(ItemsLocators.creates.internalID).type("In_" + window.uniqueId) // Defined in Commands.js
            cy.get(ItemsLocators.creates.externalID).type("Ex_" + window.uniqueId) // Defined in Commands.js
            cy.selectFromInputDropdown(ItemsLocators.creates.supplierDropdown, data.creates.supplierDropdown)
            cy.get(ItemsLocators.creates.amount).type(data.creates.amount) // Defined in Commands.js
            cy.selectFromInputDropdown(ItemsLocators.creates.unitTypeDropdown, data.creates.unitTypeDropdown)

            cy.get(ItemsLocators.creates.saveBtn).click()

            cy.wait("@createItem").its("response.statusCode").should("eq", 200)
            // cy.get(commonLocators.pageHeading).should("contain", "Item Details")
            cy.get(commonLocators.searchFilterInput).clear()
            cy.get(commonLocators.searchFilterInput).type(getUniqueName(data.creates.itemName_UNIQUE))
            cy.wait("@searchItems").its("response.statusCode").should("eq", 200)

            cy.readUniqueName(ItemsLocators.details.itemName_UNIQUE, data.creates.itemName_UNIQUE)
            cy.get(ItemsLocators.details.internalID).should("have.text", "In_" + window.uniqueId) // Defined in Commands.js
            cy.get(ItemsLocators.details.externalID).should("have.text", "Ex_" + window.uniqueId) // Defined in Commands.js
            cy.get(ItemsLocators.details.supplierDropdown).should("have.text", data.creates.supplierDropdown)
            cy.get(ItemsLocators.details.itemTypeDropdown).should("have.text", data.creates.itemTypeDropdown)
            cy.get(ItemsLocators.details.unitTypeDropdown).should("have.text", data.creates.unitTypeDropdown)
            cy.get(ItemsLocators.details.amount).should("have.text", data.creates.amount)

            cy.assertItem(getUniqueName(data.creates.itemName_UNIQUE), 1)

        })
    })

    it("Edit new created Item.", () => {
        cy.get(ItemsLocators.actionDropdown).click()
        cy.get(ItemsLocators.editBtn).click()
        cy.get(commonLocators.modalHeading).should("contain", "Edit")

        cy.fixture("Items_data").then(data => {
            cy.get(ItemsLocators.creates.itemName_UNIQUE).type(" up")
            cy.selectFromInputDropdown(ItemsLocators.creates.itemTypeDropdown, data.creates.itemTypeDropdown + "Up")
            cy.get(ItemsLocators.creates.internalID).type("Up") // Defined in Commands.js
            cy.get(ItemsLocators.creates.externalID).type("Up") // Defined in Commands.js
            cy.selectFromInputDropdown(ItemsLocators.creates.supplierDropdown, data.creates.supplierDropdown + "Up")
            cy.get(ItemsLocators.creates.amount).type("2") // Defined in Commands.js
            cy.selectFromInputDropdown(ItemsLocators.creates.unitTypeDropdown, data.creates.unitTypeDropdown + "Up")

            cy.get(ItemsLocators.creates.saveBtn).click()

            cy.wait("@updateItem").its("response.statusCode").should("eq", 200)
            // cy.get(commonLocators.pageHeading).should("contain", "Item Details")
            cy.get(commonLocators.searchFilterInput).clear()
            cy.get(commonLocators.searchFilterInput).type(getUniqueName(data.creates.itemName_UNIQUE) + " up")
            cy.wait("@searchItems").its("response.statusCode").should("eq", 200)

            cy.get(ItemsLocators.details.itemName_UNIQUE).should("have.text", getUniqueName(data.creates.itemName_UNIQUE) + " up")
            cy.get(ItemsLocators.details.internalID).should("have.text", "In_" + window.uniqueId + "Up") // Defined in Commands.js
            cy.get(ItemsLocators.details.externalID).should("have.text", "Ex_" + window.uniqueId + "Up") // Defined in Commands.js
            cy.get(ItemsLocators.details.supplierDropdown).should("have.text", data.creates.supplierDropdown + "Up")
            cy.get(ItemsLocators.details.itemTypeDropdown).should("have.text", data.creates.itemTypeDropdown + "Up")
            cy.get(ItemsLocators.details.unitTypeDropdown).should("have.text", data.creates.unitTypeDropdown + "Up")
            cy.get(ItemsLocators.details.amount).should("have.text", data.creates.amount + "2")

            cy.assertItem(getUniqueName(data.creates.itemName_UNIQUE) + " up", 1)

        })
    })

    it("Archive and delete the created Item.", () => {
        cy.get(ItemsLocators.actionDropdown).click()
        cy.get(ItemsLocators.archiveBtn).click()
        cy.get(ItemsLocators.modalConfrimBtn).click()

        cy.get(ItemsLocators.actionDropdown).click()
        cy.get(ItemsLocators.deleteBtn).click()
        cy.get(ItemsLocators.deleteConfirmBtn).click()

        cy.wait("@deleteItem").its("response.statusCode").should("eq", 204)

        // Search and check if the Item still exists or deleted properly.
        cy.fixture("Items_data").then(data => {
            cy.assertItem(getUniqueName(data.creates.itemName_UNIQUE), 0)
        })

    })
})