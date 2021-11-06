/// <reference types="Cypress" />

const TemplateLocators = require("../../Locators/TemplateLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

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

    it("Validate add step without adding mandatory fields.", () => {
        cy.get(TemplateLocators.addTemplateBtn).click()
        cy.get(commonLocators.pageHeading).should("contain", "New Template")

        cy.fixture("Template_data").then(data => {
            cy.get(TemplateLocators.newStep.addStepBtn).click()
            cy.get(TemplateLocators.newStep.removeEveryoneTeamBtn).click({ multiple: true })

            cy.elementMultipleClicks(TemplateLocators.newStep.stepTaskListMultipleClicks, data.newStep.stepTaskListMultipleClicks)
            cy.elementMultipleClicks(TemplateLocators.newStep.addTaskMultipleClicks, data.newStep.addTaskMultipleClicks)

            cy.get(TemplateLocators.saveStepBtn).click()
            cy.wait("@createStep").its("response.statusCode").should("eq", 400)

            cy.assertBorderError(TemplateLocators.saveStepInvalid.stepNameBorderError, data.saveStepInvalid.stepNameBorderError)
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.stepNameTextErrorMessage, data.saveStepInvalid.stepNameTextErrorMessage)
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.selectTeamTextErrorMessage, data.saveStepInvalid.selectTeamTextErrorMessage)

            cy.assertBorderError(TemplateLocators.saveStepInvalid.activityLabelBorderError, data.saveStepInvalid.activityLabelBorderError)
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.activityLabelTextErrorMessage, data.saveStepInvalid.activityLabelTextErrorMessage)

            cy.assertBorderError(TemplateLocators.saveStepInvalid.task1BorderError, data.saveStepInvalid.task1BorderError)
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.task1TextErrorMessage, data.saveStepInvalid.task1TextErrorMessage)

            cy.assertBorderError(TemplateLocators.saveStepInvalid.task2BorderError, data.saveStepInvalid.task2BorderError)
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.task2TextErrorMessage, data.saveStepInvalid.task2TextErrorMessage)

            cy.assertBorderError(TemplateLocators.saveStepInvalid.task3BorderError, data.saveStepInvalid.task3BorderError)
            cy.assertTextErrorMessage(TemplateLocators.saveStepInvalid.task3TextErrorMessage, data.saveStepInvalid.task3TextErrorMessage)
        })
    })

    it("Validate add step 1 with adding mandatory fields.", () => {
        // cy.get(TemplateLocators.addTemplateBtn).click()
        // cy.get(commonLocators.pageHeading).should("contain", "New Template")

        cy.fixture("Template_data").then(data => {
            // cy.get(TemplateLocators.newStep.removeEveryoneTeamBtn).click({multiple: true})
            cy.get(TemplateLocators.stepData.stepName).type(data.stepData.stepName)
            cy.selectFromDropdown(TemplateLocators.stepData.addTeamsMultipleSelect, data.stepData.addTeamsMultipleSelect, "MultipleSelect")
            cy.get(TemplateLocators.stepData.stepDescription).type(data.stepData.stepDescription)

            // Add activitities and tasks data.
            cy.enterMultipleInputs(TemplateLocators.activities.activityLabelMultipleInputs, data.activities.activityLabelMultipleInputs)
            cy.enterMultipleInputs(TemplateLocators.activities.activityDescriptionMultipleInputs, data.activities.activityDescriptionMultipleInputs)
            cy.enterMultipleInputs(TemplateLocators.activities.task1MultipleInputs, data.activities.task1MultipleInputs)
            cy.enterMultipleInputs(TemplateLocators.activities.task2MultipleInputs, data.activities.task2MultipleInputs)
            cy.get(TemplateLocators.activities.task2IsRequiredMultipleButton).click({ force: true, multiple: true })

            cy.enterMultipleInputs(TemplateLocators.activities.task3MultipleInputs, data.activities.task3MultipleInputs)
            cy.get(TemplateLocators.activities.task3IsRequiredMultipleButton).click({ force: true, multiple: true })

            cy.get(TemplateLocators.saveStepBtn).click()
            cy.wait("@createStep").its("response.statusCode").should("eq", 200)
            cy.get(commonLocators.pageHeading).should("contain", "New Template")
        
        })
    })

    it("Validate Create template without adding mandatory fields.", () => {
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
            cy.wait("@searchTemplate").its("response.statusCode").should("eq", 200)        
        })
    })
})