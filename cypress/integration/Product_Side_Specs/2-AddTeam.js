/// <reference types="Cypress" />
import { getUniqueName } from "../../support/commands.js"

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

    it("Add new Team.", () => {
        cy.get(TeamLocators.addTeamBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "New Team")

        cy.fixture("Team_data").then(data => {
            cy.enterUniqueName(TeamLocators.creates.teamName_UNIQUE, data.creates.teamName_UNIQUE)
            cy.selectFromDropdown(TeamLocators.creates.addUsersMultipleSelect, data.creates.addUsersMultipleSelect, "MultipleSelect")
            cy.get(TeamLocators.creates.description).type(data.creates.description)
            cy.get(TeamLocators.creates.saveBtn).click()

            cy.wait("@createTeam").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "Team Details")

            cy.readUniqueName(TeamLocators.details.teamName_UNIQUE, data.creates.teamName_UNIQUE)
            cy.get(TeamLocators.details.description).should("have.text", data.creates.description)
            cy.get(TeamLocators.details.addedUsersBeVisible).should("be.visible")

            cy.assertTeam(getUniqueName(data.creates.teamName_UNIQUE), 1)

        })
    })

    it("Edit new created Team.", () => {
        cy.get(TeamLocators.editBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "Edit team")

        cy.fixture("Team_data").then(data => {
            cy.get(TeamLocators.creates.teamName_UNIQUE).type(" up")
            cy.get(TeamLocators.removeMultipleUsers).click({ multiple: true })
            cy.get(TeamLocators.creates.description).type(" up")
            cy.get(TeamLocators.creates.saveBtn).click()

            cy.wait("@updateTeam").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "Team Details")

            cy.get(TeamLocators.details.teamName_UNIQUE).should("have.text", getUniqueName(data.creates.teamName_UNIQUE) + " up")
            cy.get(TeamLocators.details.description).should("have.text", data.creates.description + " up")
            cy.get(TeamLocators.details.addedUsersBeVisible).should("not.exist")

            cy.assertTeam(getUniqueName(data.creates.teamName_UNIQUE) + " up", 1)
        })
    })

    it("Archive and delete the created team.", () => {
        cy.get(TeamLocators.archiveBtn).click()
        cy.get(TeamLocators.modalConfrimBtn).click()

        cy.get(TeamLocators.deleteBtn).click()
        cy.get(TeamLocators.modalConfrimBtn).click()

        cy.wait("@deleteTeam").its("response.statusCode").should("eq", 204)

        // Search and check if the team still exists or deleted properly.
        cy.fixture("Team_data").then(data => {
            cy.assertTeam(getUniqueName(data.creates.teamName_UNIQUE), 0)
        })

    })
})