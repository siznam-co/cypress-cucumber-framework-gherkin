/// <reference types="Cypress" />

import 'cypress-mailosaur'

const commonLocators = require("../Locators/commonLocators.json")
const SignInLocators = require("../Locators/SignInLocators.json")

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key]
    })
})

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add("loginWithApi", (username, password) => {

    cy.request({
        method: "POST",
        url: "/api/auth/login",
        headers: {
            "Host": Cypress.config().baseUrl.split("//")[1],
            "Connection": "keep-alive",
            "Accept": "application/json, text/plain, */*",
            // "Authorization": "Bearer undefined",
            "Origin": "/",
            "Referer": "/login",
        },
        followRedirect: true,
        form: false,
        body: { 
            "email": username, 
            "password": password, 
            "localeId": "en"
        }
    }).then((response) => {
        expect(response.status).equal(200)
        // Storing user Data in Cache
        cy.window().then((window) => {
            window.localStorage.setItem("profile", JSON.stringify(response.body))
            window.localStorage.setItem("i18nextLng", "en")
            cy.log("The user logged in successfully")
            cy.visit("/login")
        })
    })
})

Cypress.Commands.add("loginWithUI", (username, password) => {
    cy.visit("/login")
    // Check if the user is on the login page. 
    cy.get(SignInLocators.emailField).should("be.visible")

    // Enter credentials and log in.
    cy.get(SignInLocators.emailField).type(username)
    cy.get(SignInLocators.passwordField).type(password)
    cy.get(SignInLocators.rememberCheckBox).click()

    cy.get(SignInLocators.submitButton).click()
})

Cypress.Commands.add("runRoutes", () => {

    cy.intercept("POST", "/api/team2").as("createTeam") 
    cy.intercept("POST", "/api/step/validate").as("createStep")
    cy.intercept("POST", "/api/template/list").as("searchTemplate")
    cy.intercept("POST", "/api/workflowRun/quick-run").as("createChecklist")
    cy.intercept("POST", "/api/template").as("createTemplate")
    cy.intercept("PUT", "/api/template").as("updateTemplate")    
    cy.intercept("GET", "/api/team/published").as("publishTemplate")
})