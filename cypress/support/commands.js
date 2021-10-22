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
            "Host": "test-2.ampliflow.com",
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

Cypress.Commands.add("getUniqueEmail", (previousEmail) => {
    let halfEmail = previousEmail.split("+")[1]
    let uniqueNumber = halfEmail.split("@")[0]
    uniqueNumber = parseInt(uniqueNumber) + 1
    let newEmail = "qa.abdullah360+" + uniqueNumber + "@gmail.com"
    return newEmail
})

Cypress.Commands.add("getUniqueName", (previousName, role) => {   // theqa13119+User1
    let firstHalf = previousName.split("+")[0]                   // theqa13119
    let secondHalf = previousName.split("+")[1]                  // User1@gmail.com
    let uniqueValue = secondHalf.split("@")[0]                    // User1
    let uniqueNumber = uniqueValue.split(role)[1]                 // 1
    uniqueNumber = parseInt(uniqueNumber) + 1                     // 1 + 1
    let newName = firstHalf + "+" + role + uniqueNumber    // theqa13119 + '+' + User + 2 
    return newName
})

Cypress.Commands.add("getUniqueEmail", (previousEmail, role) => { // theqa13119+User1@gmail.com
    let firstHalf = previousEmail.split("+")[0]                   // theqa13119
    let secondHalf = previousEmail.split("+")[1]                  // User1@gmail.com
    let thirdHalf = secondHalf.split("@")[1]                      // gmail.com
    let uniqueValue = secondHalf.split("@")[0]                    // User1
    let uniqueNumber = uniqueValue.split(role)[1]                 // 1
    uniqueNumber = parseInt(uniqueNumber) + 1                     // 1 + 1
    let newEmail = firstHalf + "+" + role + uniqueNumber + "@" + thirdHalf    // theqa13119 + '+' + User + 2 + '@' + gmail.com
    return newEmail
})

Cypress.Commands.add("getAfterValue", (selector, pseudo, property) => {
    cy.get(selector)
        .parent().then($els => {
            // get Window reference from element
            const win = $els[0].ownerDocument.defaultView
            // use getComputedStyle to read the pseudo selector
            const after = win.getComputedStyle($els[0], pseudo)
            // read the value of the `content` CSS property
            const contentValue = after.getPropertyValue(property)
            // the returned value will have double quotes around it, but this is correct
            return contentValue
            // expect(contentValue).to.eq("rgb(229, 57, 53)")
        })
})

var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

Cypress.Commands.add("numToWords", (num) => {
    if ((num = num.toString()).length > 9) return 'overflow'
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!n) return; var str = ''
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : ''
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : ''
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : ''
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : ''
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])  : ''
    return str
})

Cypress.Commands.add("runRoutes", () => {

    cy.intercept("POST", "/api/team2").as("createTeam") 
    cy.intercept("POST", "/api/step/validate").as("createStep")
    cy.intercept("POST", "/api/template/list").as("searchTemplate")
    cy.intercept("POST", "/api/workflowRun/quick-run").as("createChecklist")
})