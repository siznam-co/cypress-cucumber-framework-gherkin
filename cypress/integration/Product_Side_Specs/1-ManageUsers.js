/// <reference types="Cypress" />
import { getUniqueEmail, getUniqueName } from "../../support/commands.js"

const UserLocators = require("../../Locators/UserLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

describe("Add a new user", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Administrator").click()
        cy.get(commonLocators.subMenuBtn).contains("Manage Users").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Manage Users")
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Add new User and verify it's detail.", () => {
        cy.get(UserLocators.addUserBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "New User")

        cy.fixture("User_data").then(data => {
            cy.enterUniqueEmail(UserLocators.creates.email_UNIQUE, data.creates.email_UNIQUE)
            cy.enterUniqueName(UserLocators.creates.userName_UNIQUE, data.creates.userName_UNIQUE)
            cy.get(UserLocators.creates.password).type(data.creates.password)
            cy.get(UserLocators.creates.confirmPassword).type(data.creates.confirmPassword)
            cy.get(UserLocators.creates.saveBtn).click()

            cy.wait("@createUser").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "User Details")
            
            cy.readUniqueEmail(UserLocators.details.email_UNIQUE, data.creates.email_UNIQUE)
            cy.readUniqueName(UserLocators.details.userName_UNIQUE, data.creates.userName_UNIQUE)

            cy.assertUser(getUniqueName(data.creates.userName_UNIQUE), 1)

        })
    })

    it("Edit created User and verify it's detail.", () => {
        cy.get(UserLocators.editBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "Edit user")

        cy.fixture("User_data").then(data => {
            cy.get(UserLocators.creates.email_UNIQUE).type("up")
            cy.get(UserLocators.creates.userName_UNIQUE).type("up")
            cy.get(UserLocators.creates.password).type("up")
            cy.get(UserLocators.creates.confirmPassword).type("up")
            cy.get(UserLocators.creates.saveBtn).click()

            cy.wait("@updateUser").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "User Details")
            
            cy.get(UserLocators.details.email_UNIQUE).should("have.text", getUniqueEmail(data.creates.email_UNIQUE) + "up")
            cy.get(UserLocators.details.userName_UNIQUE).should("have.text", getUniqueName(data.creates.userName_UNIQUE) + "up")

            cy.assertUser(getUniqueName(data.creates.userName_UNIQUE) + "up", 1)

        })
    })

    it("Disable the created user.", () => {
        cy.get(UserLocators.disableBtn).click()
        cy.get(UserLocators.modalConfrimBtn).click()

        cy.wait("@disableUser").its("response.statusCode").should("eq", 200)
        cy.get(UserLocators.disableBtn).should("be.disabled")

    })
})