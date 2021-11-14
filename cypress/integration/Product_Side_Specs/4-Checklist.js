/// <reference types="Cypress" />

const ChecklistLocators = require("../../Locators/ChecklistLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

describe("Create and run new Checklist.", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.createTemplateUsingApi()
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Create a Checklist.", () => {
        cy.get(ChecklistLocators.runChecklistBtn).click()
        cy.get(ChecklistLocators.creates.addChecklistHeaderContainsText).should("contain", "Run Checklist")

        cy.fixture("Checklist_data").then(data => {
            cy.enterUniqueName(ChecklistLocators.creates.checklistName_UNIQUE, data.creates.checklistName_UNIQUE)
            cy.selectFromDropdown(ChecklistLocators.creates.addTemplateSingleSelect, data.creates.addTemplateSingleSelect, "SingleSelect")
            // cy.wait("@addTemplateToChecklist").its("response.statusCode").should("eq", 200)
            cy.get(ChecklistLocators.creates.saveBtn).click()

            cy.wait("@createChecklist").its("response.statusCode").should("eq", 200)
        })
    })

    it("Run a Checklist and validate mandatory fields.", () => {
        cy.get(ChecklistLocators.finalizeBtn).click()

        cy.fixture("Checklist_data").then(data => {
            // ChecklistLocators.finalizeInvalid.mandatoryFieldLabel.
            cy.assertMandatoryFieldLabelError(ChecklistLocators.finalizeInvalid.mandatoryFieldLabel, data.finalizeInvalid.mandatoryFieldLabel)
            
            cy.get(ChecklistLocators.runs.activityCheckbox).each((col, index, list) => {
                cy.wrap(col).click()
            })
            cy.get(ChecklistLocators.runs.cancelBtn).click()

            cy.get(ChecklistLocators.finalizeBtn).click()
            cy.wait("@finalizeStep").its("response.statusCode").should("eq", 200)
            cy.assertMandatoryFieldLabelError(ChecklistLocators.finalizeValid.mandatoryFieldLabel, data.finalizeValid.mandatoryFieldLabel)
        })
    })
})