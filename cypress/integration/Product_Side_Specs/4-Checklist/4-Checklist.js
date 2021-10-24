/// <reference types="Cypress" />
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps"

const ChecklistLocators = require("../../../Locators/ChecklistLocators.json")

When("the user hits {string} button.", (btn) => {
    cy.get(ChecklistLocators[btn]).click() 
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
    cy.get(ChecklistLocators[operation + "Btn"]).click()
    submitOperation(operation + "Invalid", fieldsType, "invalid")
})

When("the user hits {string} with submitting all mandatory fields at the {string} screen.", (operation, fieldsType) => { 
    cy.get(ChecklistLocators[operation + "Btn"]).click()
    submitOperation(operation + "Valid", fieldsType, "valid")
})

Then("Initially, the {string} should not be clickable at {string} screen.", (operation, fieldsType) => {
    readOperation(operation, fieldsType)
})