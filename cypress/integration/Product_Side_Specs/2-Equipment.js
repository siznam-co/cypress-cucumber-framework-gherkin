/// <reference types="Cypress" />
import { getUniqueName, convertedDateForm} from "../../support/commands.js"

const equipmentLocators = require("../../Locators/equipmentLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

describe("Add new Equipment and add users to it.", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Lists").click()
        cy.get(commonLocators.subMenuBtn).contains("Equipment").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Equipment")
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Add new Equipment screen is opened.", () => {
        cy.get(equipmentLocators.addEquipmentBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "New Equipment")

        cy.fixture("Equipment_data").then(data => {
            cy.enterUniqueName(equipmentLocators.creates.equipmentName_UNIQUE, "Equip_1")
            cy.get(equipmentLocators.creates.idNumber).type(window.uniqueId)
            cy.get(equipmentLocators.creates.nextDate).type(data.creates.nextDate)
            cy.get(equipmentLocators.creates.description).type(data.creates.description)
            cy.get(equipmentLocators.creates.comments).type(data.creates.comments)
            cy.get(equipmentLocators.creates.saveBtn).click()

            cy.wait("@createEquipment").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "Equipment Details")

            cy.readUniqueName(equipmentLocators.details.equipmentName_UNIQUE, data.creates.equipmentName_UNIQUE)
            cy.get(equipmentLocators.details.idNumber).should("have.text", "#" + window.uniqueId)
            cy.get(equipmentLocators.details.nextDate).should("contain", convertedDateForm(data.creates.nextDate))
            cy.get(equipmentLocators.details.description).should("have.text", data.creates.description)
            cy.get(equipmentLocators.details.comments).should("have.text", data.creates.comments)

            cy.assertEquipment(getUniqueName(data.creates.equipmentName_UNIQUE), 1)

        })
    })

    it("Archive and delete the created Equipment.", () => {
        cy.get(equipmentLocators.archiveBtn).click()
        cy.get(equipmentLocators.modalConfrimBtn).click()

        cy.get(equipmentLocators.deleteBtn).click()
        cy.get(equipmentLocators.modalConfrimBtn).click()

        cy.wait("@deleteEquipment").its("response.statusCode").should("eq", 204)

        // Search and check if the Equipment still exists or deleted properly.
        cy.fixture("Equipment_data").then(data => {
            cy.assertEquipment(getUniqueName(data.creates.equipmentName_UNIQUE), 0)
        })

    })
})