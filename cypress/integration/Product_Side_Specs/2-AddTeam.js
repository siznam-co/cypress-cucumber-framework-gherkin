/// <reference types="Cypress" />

const TeamLocators = require("../../Locators/TeamLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

describe("Add new team and add users to it.", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Lists").click()
        cy.get(commonLocators.subMenuBtn).contains("Teams").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Teams")
        // create Users Using Api if not already exists.
        cy.createUsersUsingApi()
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Add new Team screen is opened.", () => {
        cy.get(TeamLocators.addTeamBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "New Team")

        cy.fixture("Team_data").then(data => {
            cy.enterUniqueName(TeamLocators.creates.teamName_UNIQUE, data.creates.teamName_UNIQUE)
            cy.selectFromDropdown(TeamLocators.creates.addUsersMultipleSelect, data.creates.addUsersMultipleSelect, "MultipleSelect")
            cy.get(TeamLocators.creates.description).type(data.creates.description)
            cy.get(TeamLocators.creates.saveBtn).click()

            cy.wait("@createTeam").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "Team Details")
            
            cy.getUniqueName(TeamLocators.details.teamName_UNIQUE, data.creates.teamName_UNIQUE)
            cy.get(TeamLocators.details.description).should("have.text", data.creates.description)
            cy.get(TeamLocators.details.addedUsersBeVisible).should("be.visible")
        })    
    })
})