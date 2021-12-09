// Import commands.js using ES2015 syntax:
import './commands'
const commonLocators = require("../Locators/commonLocators.json")

// Alternatively you can use CommonJS syntax:
// require('./commands')

before(() => {
    // Login in to app.
    cy.log("This is outer before call")
    // cy.loginWithUI(Cypress.env("Username"), Cypress.env("Password"))
    // cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
    cy.runRoutes()

})

after(() => {
    cy.clearLocalStorage()
})

beforeEach(() => {
    cy.restoreLocalStorage()
    cy.runRoutes()
    Cypress.Cookies.preserveOnce('ai_session', 'ai_user', "intercom-session-kpptzcy2")
})

afterEach(() => {
    cy.saveLocalStorage()
})