/// <reference types="Cypress" />
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps"
import { createOperation, generateFullUUID, readOperation, submitOperation } from "../../common/helpers"

const TeamLocators = require("../../../Locators/TeamLocators.json")

export function createUsersUsingApi() {
    let userID = generateFullUUID()

    cy.fixture("Users").then(newUser => {
        for (let user in newUser) {
            newUser[user]["id"] = userID
            let name = newUser[user]["userName"]
            cy.log(newUser[user]["userName"])
            let profileData = window.localStorage.getItem("profile")
            let token = JSON.parse(profileData)["token"]
            let cookiesArr = ""
            cy.getCookies()
                .then((cookies) => {
                    for (let cookie in cookies) {
                        cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
                    }

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
                        body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
                    }).then((response) => {
                        expect(response.status).equal(200)
                        if (response.body.totalCount == 0) {
                            cy.request({
                                method: "POST",
                                url: "/api/user",
                                headers: {
                                    "Host": Cypress.config().baseUrl.split("//")[1],
                                    "Connection": "keep-alive",
                                    "Accept": "application/json, text/plain, */*",
                                    "Authorization": "Bearer " + token,
                                    "Origin": Cypress.config().baseUrl,
                                    "Referer": Cypress.config().baseUrl + "/templates/add",
                                    "cookie": cookiesArr
                                },
                                body: newUser[user]
                            }).then((response) => {
                                expect(response.status).equal(200)
                            })
                        } else {
                            cy.log("This User is already created.")
                        }
                    })

                })
        }
    })
}

When("the user hits {string} button.", (btn) => {
    cy.get(TeamLocators[btn]).click()
})

When("the user adds {string} at the {string} screen.", (operation, fieldsType) => {
    createOperation(operation, fieldsType)
})

Given("The user creates Users if do not exist already.", () => {
    createUsersUsingApi()
})

When("the user {string} a {string}.", (operation, fieldsType) => {
    createOperation(operation, fieldsType)
})

Then("the {string} appears for the created {string} should be correct.", (operation, fieldsType) => {
    readOperation(operation, fieldsType)
})

When("the user hits {string} without submitting mandatory fields at the {string} screen.", (operation, fieldsType) => {
    cy.get(TeamLocators[operation + "Btn"]).click()
    submitOperation(operation + "Invalid", fieldsType, "invalid")
})

When("the user hits {string} with submitting all mandatory fields at the {string} screen.", (operation, fieldsType) => {
    cy.get(TeamLocators[operation + "Btn"]).click()
    submitOperation(operation + "Valid", fieldsType, "valid")
})

Then("Initially, the {string} should not be clickable at {string} screen.", (operation, fieldsType) => {
    readOperation(operation, fieldsType)
})