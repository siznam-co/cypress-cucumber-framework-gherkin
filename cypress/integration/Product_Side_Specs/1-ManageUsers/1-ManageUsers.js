/// <reference types="Cypress" />
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps"
import { submitOperation, readOperation, createOperation, getUniqueName, getUniqueEmail} from "../../common/helpers.js"

const UserLocators = require("../../../Locators/UserLocators.json")

When("the user hits {string} button.", (btn) => {
    cy.get(UserLocators[btn]).click()
})

Then("the new email for the future {string} should be stored.", (fieldsType) => {
    cy.fixture(fieldsType + "_data").then(returnedData => {
        // Storing name for future records create operation
        let newUserName = getUniqueName(returnedData.creates.userName, fieldsType) 
            returnedData.creates.userName = newUserName
            returnedData.details.userName = newUserName
        
            // Storing email for future records create operation
            // If the future create operation has email too. 
        let newEmail = getUniqueEmail(returnedData.creates.email, fieldsType)
        returnedData.creates.email = newEmail
        returnedData.details.email = newEmail
        cy.writeFile("cypress/fixtures/User_data.json", JSON.stringify(returnedData))
    })
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

When("the user hits {string} without submitting mandatory fields at the {string} screen.", (operation, fieldsType) => {
    cy.get(UserLocators[operation + "Btn"]).click()
    submitOperation(operation + "Invalid", fieldsType, "invalid")
})

When("the user hits {string} with submitting all mandatory fields at the {string} screen.", (operation, fieldsType) => { 
    cy.get(UserLocators[operation + "Btn"]).click()
    submitOperation(operation + "Valid", fieldsType, "valid")
})

Then("Initially, the {string} should not be clickable at {string} screen.", (operation, fieldsType) => {
    readOperation(operation, fieldsType)
    
})