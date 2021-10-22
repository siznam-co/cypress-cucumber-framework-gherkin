/// <reference types="Cypress" />

Then("the new email for the future {string} should be stored.", (fieldsType) => {
    cy.fixture(fieldsType + "_data").then(returnedData => {
        // Storing name for future records create operation
        cy.getUniqueName(returnedData.creates.userName, fieldsType).then(newUserName => {
            returnedData.creates.userName = newUserName
            returnedData.details.userName = newUserName
        
            // Storing email for future records create operation
            // If the future create operation has email too. 
            cy.getUniqueEmail(returnedData.creates.email, fieldsType).then(newEmail => {
                returnedData.creates.email = newEmail
                returnedData.details.email = newEmail
                cy.writeFile("cypress/fixtures/User_data.json", JSON.stringify(returnedData))
            }) 
        })    
    })
})