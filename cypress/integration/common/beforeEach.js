beforeEach(() => {
    cy.restoreLocalStorage()
    cy.runRoutes()
    Cypress.Cookies.preserveOnce('ai_session', 'ai_user', "intercom-session-kpptzcy2")
})
