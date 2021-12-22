/// <reference types="Cypress" />

const RecurringChecklistLocators = require("../../Locators/RecurringChecklistLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")
describe("Create and run new RecurringChecklist.", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Scheduling").click()
        cy.get(commonLocators.subMenuBtn).contains("Recurring Checklists").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Recurring Checklists")
        cy.createUsersUsingApi()
    })
    it("Create a Reccuring Checklist.", () => {
       cy.get('div.page--title button').click()
     cy.get('input #form.Name').type('abdullah')
    })


})