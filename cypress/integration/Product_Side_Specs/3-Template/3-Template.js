/// <reference types="Cypress" />
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps"
import { createOperation, generateFullUUID, readOperation, submitOperation } from "../../common/helpers"

const TemplateLocators = require("../../../Locators/TemplateLocators.json")
import { createUsersUsingApi } from "../2-AddTeam/2-AddTeam.js"

function createTeamsUsingApi() {
    let TeamID = generateFullUUID()

    cy.fixture("Teams").then(newTeam => {
        newTeam.id = TeamID
        let name = newTeam.name
        let profileData = window.localStorage.getItem("profile")
        let token = JSON.parse(profileData)["token"]
        let cookiesArr = ""
        cy.getCookies()
            .then((cookies) => {
                for (let cookie in cookies) {
                    cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
                }

                // Create Users if not existed previously.
                createUsersUsingApi()

                cy.fixture("Users").then(newUser => {
                    cy.request({
                        method: "POST",
                        url: "/api/User/list",
                        headers: {
                            "Host": Cypress.config().baseUrl.split("//")[1],
                            "Connection": "keep-alive",
                            "Accept": "application/json, text/plain, */*",
                            "Authorization": "Bearer " + token,
                            "Origin": Cypress.config().baseUrl,
                            "Referer": Cypress.config().baseUrl + "/users",
                            "cookie": cookiesArr
                        },
                        body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": "user_" }
                    }).then((response) => {
                        expect(response.status).equal(200)
                        if (response.body.totalCount == 0) {
                            
                        } else {
                            let allUsers = response.body.items
                            let selectedUsersIds = []
                            for (let user in allUsers) {
                                selectedUsersIds[user] = allUsers[user]["id"]
                            }
                            newTeam.userIds = selectedUsersIds
                            // --------
                            cy.request({
                                method: "POST",
                                url: "/api/team2/list",
                                headers: {
                                    "Host": Cypress.config().baseUrl.split("//")[1],
                                    "Connection": "keep-alive",
                                    "Accept": "application/json, text/plain, */*",
                                    "Authorization": "Bearer " + token,
                                    "Origin": Cypress.config().baseUrl,
                                    "Referer": Cypress.config().baseUrl + "/teams",
                                    "cookie": cookiesArr
                                },
                                body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
                            }).then((response) => {
                                expect(response.status).equal(200)
                                if (response.body.totalCount == 0) {
                                    cy.request({
                                        method: "POST",
                                        url: "/api/team2",
                                        headers: {
                                            "Host": Cypress.config().baseUrl.split("//")[1],
                                            "Connection": "keep-alive",
                                            "Accept": "application/json, text/plain, */*",
                                            "Authorization": "Bearer " + token,
                                            "Origin": Cypress.config().baseUrl,
                                            "Referer": Cypress.config().baseUrl + "teams/add",
                                            "cookie": cookiesArr
                                        },
                                        body: newTeam
                                    }).then((response) => {
                                        expect(response.status).equal(200)
                                    })
                                } else {
                                    cy.log("This Team is already created.")
                                }
                            })

                        }
                    })
                })
                
            })
    })    
}

Given("The user creates Teams if do not exist already.", () => {
    createTeamsUsingApi()
})

When("the user hits {string} button..", (btn) => {
    cy.get(TemplateLocators[btn]).click() 
})

When("the user adds {string} at the {string} screen.", (operation, fieldsType) => {
    createOperation(operation, fieldsType)
})

When("the user {string} the {string}.", (operation, fieldsType) => {
    createOperation(operation, fieldsType)
})

Then("the {string} appears for the created {string} should be correct.", (operation, fieldsType) => {
    readOperation(operation, fieldsType)
})

When("the user hits {string} without submitting mandatory fields at the {string} screen..", (operation, fieldsType) => {
    cy.get(TemplateLocators[operation + "Btn"]).click()
    submitOperation(operation + "Invalid", fieldsType, "invalid")
})

When("the user hits {string} with submitting all mandatory fields at the {string} screen..", (operation, fieldsType) => { 
    cy.get(TemplateLocators[operation + "Btn"]).click()
    submitOperation(operation + "Valid", fieldsType, "valid")
})

Then("Initially, the {string} should not be clickable at {string} screen.", (operation, fieldsType) => {
    readOperation(operation, fieldsType)
})
