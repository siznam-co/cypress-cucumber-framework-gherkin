/// <reference types="Cypress" />

import { getColor, getUniqueName } from "../../support/commands.js"
import 'cypress-file-upload'

const TemplateLocators = require("../../Locators/TemplateLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

function addStep(number) {
    cy.fixture("Template_data").then(data => {

        cy.get(TemplateLocators.newStep.addStepBtn).click()
        cy.get(TemplateLocators.newStep.removeEveryoneTeamBtn).click({ multiple: true })
        // Add all activities and verify each step mandatory field assertions
        addActivity(data, "Value")
        addActivity(data, "Text")
        addActivity(data, "Tasklist")
        addActivity(data, "Photo")
        addActivity(data, "Selection")
        addActivity(data, "Customers")
        addActivity(data, "Suppliers")
        addActivity(data, "Items")
        addActivity(data, "Barcodes")

        // Validating Step mandatory fields.
        cy.get(TemplateLocators.saveStepBtn).click()
        cy.wait("@createStep").its("response.statusCode").should("eq", 400)

        cy.assertBorderError(TemplateLocators.saveStepInvalid.stepNameBorderError, data.saveStepInvalid.stepNameBorderError)
        cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.stepNameTextErrorMessage, data.saveStepInvalid.stepNameTextErrorMessage)
        cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.selectTeamTextErrorMessage, data.saveStepInvalid.selectTeamTextErrorMessage)

        // Now enter mandatory fields and assert.
        cy.get(TemplateLocators.stepData.stepName).type(data.stepData.stepName + number)
        cy.selectFromDropdown(TemplateLocators.stepData.addTeamsMultipleSelect, data.stepData.addTeamsMultipleSelect, "MultipleSelect")
        cy.get(TemplateLocators.stepData.stepDescription).type(data.stepData.stepDescription)


        cy.get(TemplateLocators.saveStepBtn).click()
        // cy.wait("@createStep").its("response.statusCode").should("eq", 400)
      cy.wait("@createStep").its("response.statusCode").should("eq", 200)
        cy.get(commonLocators.pageHeading).should("contain", "New Template")

    })
}

function addActivity(data, activity) {
    cy.get(TemplateLocators.addActivity.addStepActivityBtn).contains(activity).click()
    cy.get(TemplateLocators.saveStepBtn).click()
    cy.wait("@createStep").its("response.statusCode").should("eq", 400)

    cy.get(TemplateLocators.saveStepInvalid.activityLabelBorderError).parent().should("have.css", "border-color", getColor("invalid"))
    cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.activityLabelTextErrorMessage, data.saveStepInvalid.activityLabelTextErrorMessage)

    // Now filling all fields. 
    cy.get(TemplateLocators.addActivity.activityLabelInput).type(activity + data.addActivity.activityLabelInput)
    cy.get(TemplateLocators.addActivity.activityDescriptionInput).type(data.addActivity.activityDescriptionInput + activity)
    cy.get(TemplateLocators.addActivity.activityPhotoPlaceHolder).attachFile(activity + ".jpg")

    cy.get(TemplateLocators.addActivity.attachementDropdown).select("1")
    cy.get(TemplateLocators.addActivity.attachementName).type(activity + "_Link")
    cy.get(TemplateLocators.addActivity.attachementUrl).type("https://www.google.com/search?q=\"" + activity + "\"")
    cy.get(TemplateLocators.addActivity.saveModalBtn).click()
    cy.wait("@addAttachment").its("response.statusCode").should("eq", 204)

    cy.get(TemplateLocators.addActivity.attachementDropdown).select("2")
    cy.get(TemplateLocators.addActivity.attachementName).type(activity + "_File")
    cy.get(TemplateLocators.addActivity.attachementImage).attachFile(activity + ".jpg")
    cy.get(TemplateLocators.addActivity.uploadModal).should("contain", activity + ".jpg")
    cy.get(TemplateLocators.addActivity.saveModalBtn).click()
    cy.wait("@addAttachment").its("response.statusCode").should("eq", 204)

    fillActitivitySpecificFields(data, activity)

    cy.get(TemplateLocators.saveStepBtn).click()
    cy.wait("@createStep").its("response.statusCode").should("eq", 400)
    // Again asserting if the erros are gone or not
    cy.get(TemplateLocators.addActivity.activityLabelInput).parent().should("have.css", "border-color", getColor("validBorder"))

    cy.get(TemplateLocators.addActivity.saveActivityBtn).click()
}

function fillActitivitySpecificFields(data, activity) {
    switch (activity) {
        case "Value":
            cy.get(TemplateLocators.addActivity.placeholder).last().type(data.addActivity[activity])
            break
        case "Text":
            cy.get(TemplateLocators.addActivity.textActivityPlaceHolder).type(data.addActivity[activity])
            break
        case "Tasklist":
            cy.elementMultipleClicks(TemplateLocators.addActivity.addTaskMultipleClicks, data.addActivity.addTaskMultipleClicks)

            cy.get(TemplateLocators.saveStepInvalid.task1BorderError).parent().should("have.css", "border-color", getColor("invalid"))
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.task1TextErrorMessage, data.saveStepInvalid.task1TextErrorMessage)

            cy.get(TemplateLocators.saveStepInvalid.task2BorderError).parent().should("have.css", "border-color", getColor("invalid"))
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.task2TextErrorMessage, data.saveStepInvalid.task2TextErrorMessage)

            cy.get(TemplateLocators.saveStepInvalid.task3BorderError).parent().should("have.css", "border-color", getColor("invalid"))
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.task3TextErrorMessage, data.saveStepInvalid.task3TextErrorMessage)

            // Now entering all tasks
            cy.enterMultipleInputs(TemplateLocators.addActivity.Tasklist.taskMultipleInputs, data.addActivity.Tasklist.task1MultipleInputs)
            cy.get(TemplateLocators.addActivity.Tasklist.task2IsRequiredMultipleButton).click({ force: true })
            cy.get(TemplateLocators.addActivity.Tasklist.task3IsRequiredMultipleButton).click({ force: true })

            cy.get(TemplateLocators.saveStepBtn).click()
            cy.wait("@createStep").its("response.statusCode").should("eq", 400)
            // Again asserting if the erros are gone or not
            cy.get(TemplateLocators.saveStepInvalid.task1BorderError).parent().should("have.css", "border-color", getColor("validBorder"))
            cy.get(TemplateLocators.saveStepInvalid.task2BorderError).parent().should("have.css", "border-color", getColor("validBorder"))
            cy.get(TemplateLocators.saveStepInvalid.task3BorderError).parent().should("have.css", "border-color", getColor("validBorder"))
            break

        case "Photo":
            // This feature is not implemented yet.
            break
        case "Selection":
            cy.get(TemplateLocators.addActivity.textActivityPlaceHolder).last().type(data.addActivity[activity])
            break
        case "Customers":
            cy.get(TemplateLocators.addActivity.placeholder).last().type(data.addActivity[activity])
            break
        case "Suppliers":
            cy.get(TemplateLocators.addActivity.placeholder).last().type(data.addActivity[activity])
            break
        case "Items":
            cy.get(TemplateLocators.addActivity.placeholder).last().type(data.addActivity[activity])
            break
        case "Barcodes":
            // Selecting single barcode 
            cy.get(TemplateLocators.addActivity.barcodeDropdown).select("false")
            break
    }
}

describe("Add new template.", () => {
    before(() => {
        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Templates").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Templates")
        // create Teams Using Api if not already exists.
        cy.createTeamsUsingApi()
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Validate add steps mandatory fields.", () => {
        cy.get(TemplateLocators.addTemplateBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "New Template")

        addStep(" 1") // step 1
        addStep(" 2") // step 2
        addStep(" 3") // step 3
    })

    it("Validate Create template mandatory fields.", () => {
        cy.get(TemplateLocators.saveAndPublishBtn).click()
        cy.wait("@createTemplate").its("response.statusCode").should("eq", 400)

        cy.fixture("Template_data").then(data => {
            cy.assertBorderError(TemplateLocators.saveAndPublishInvalid.templateNameBorderError, data.saveAndPublishInvalid.templateNameBorderError)
            cy.assertTextErrorMessage(TemplateLocators.saveAndPublishInvalid.templateNameTextErrorMessage, data.saveAndPublishInvalid.templateNameTextErrorMessage)

            // Enter all mandatory fields now. 
            cy.enterUniqueName(TemplateLocators.creates.templateName_UNIQUE, data.creates.templateName_UNIQUE)
            cy.get(TemplateLocators.creates.summary).type(data.creates.summary)
            cy.get(TemplateLocators.saveAndPublishBtn).click()

            cy.wait("@createTemplate").its("response.statusCode").should("eq", 200)
            cy.wait("@publishTemplate").its("response.statusCode").should("eq", 200)

            cy.assertTemplate(getUniqueName(data.creates.templateName_UNIQUE), 1)

        })
    })


    it("Archive and delete the Template.", () => {
        cy.fixture("Template_data").then(data => {
            cy.get(commonLocators.searchFilterInput).clear()
            cy.get(commonLocators.searchFilterInput).type(getUniqueName(data.creates.templateName_UNIQUE))
            cy.wait("@searchTemplate").its("response.statusCode").should("eq", 200)


            cy.get(TemplateLocators.actionDropdown).click()
            cy.get(TemplateLocators.archiveBtn).click()
            cy.get(TemplateLocators.modalConfrimBtn).click()

            cy.get(TemplateLocators.actionDropdown).click()
            cy.get(TemplateLocators.deleteBtn).click()
            cy.get(TemplateLocators.deleteConfirmBtn).click()

            cy.wait("@deleteTemplate").its("response.statusCode").should("eq", 204)

            // Search and check if the Item still exists or deleted properly.
            cy.assertTemplate(getUniqueName(data.creates.templateName_UNIQUE), 0)

        })
    })


})