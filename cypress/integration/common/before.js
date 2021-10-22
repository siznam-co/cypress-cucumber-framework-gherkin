before(() => {
    // Login in to app.
    cy.log("This is outer before call")
    // cy.loginWithUI(Cypress.env("Username"), Cypress.env("Password"))
    cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
})  