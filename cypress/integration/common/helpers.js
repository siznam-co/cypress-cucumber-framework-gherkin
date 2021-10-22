/// <reference types="Cypress" />

import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps"
import 'cypress-file-upload'

const commonLocators = require("../../Locators/commonLocators.json")
const UserLocators = require("../../Locators/UserLocators.json")
const TeamLocators = require("../../Locators/TeamLocators.json")
const TemplateLocators = require("../../Locators/TemplateLocators.json")
const ChecklistLocators = require("../../Locators/ChecklistLocators.json")

const modifierKey = Cypress.platform === "darwin" ? "meta" : "ctrl";

function getLocators(fieldsType) {
    switch (fieldsType) {
        case "User":
            return UserLocators
        case "Team":
            return TeamLocators
        case "Template":
            return TemplateLocators
        case "Checklist":
            return ChecklistLocators
        default:
            return FlowLocators
    }
}

function getColor(type) {
    switch (type) {
        case "valid":
            return "rgb(4, 9, 48)"
        case "invalid":
            return "rgb(255, 130, 130)"
    }
}

function createOperation(operation, fieldsType) {
    let locators = getLocators(fieldsType)
    let Locs = locators[operation]
    cy.fixture(fieldsType + "_data").then(returnedData => {
        let data = returnedData[operation]
        for (let loc in Locs) {
            if (loc.includes("Checkbox")) {
                cy.get(Locs[loc]).each((col, index, list) =>
                    cy.wrap(col).click()
                )

            } else if (loc.includes("MultipleSelect")) {

                cy.get(Locs[loc]["dropdown"]).click()
                cy.get(Locs[loc]["input"]).type(data[loc])
                cy.get(Locs[loc]["options"]).click({ multiple: true })
                cy.get(Locs[loc]["dropdown"]).click()

            } else if (loc.includes("SingleSelect")) {

                cy.get(Locs[loc]["dropdown"]).click()
                cy.get(Locs[loc]["input"]).type(data[loc])
                cy.get(Locs[loc]["options"]).click()
                cy.get(Locs[loc]["dropdown"]).click()

            } else if (loc.includes("TextButton")) {
                cy.get(Locs[loc]).contains(data[loc]).click({ force: true })

            } else if (loc.includes("ImageHolder")) {
                cy.get(Locs[loc]).attachFile(data[loc])

            } else if (loc.includes("Types")) {
                for (let type in data[loc]) {
                    cy.get(Locs[loc]).contains(data[loc][type]).click()
                }

            } else if (loc.includes("Btn")) {
                cy.get(Locs[loc]).click({ force: true })

            } else if (loc.includes("Radio")) {
                cy.get(Locs[loc]).check(data[loc])

            } else if (loc.includes("TabButton")) {
                cy.get(Locs[loc]).click({ force: true })

            } else if (loc.includes("Identifier")) {
                cy.get(Locs[loc]).contains(data[loc])
                    .parents(locators["changeThisParam"])
                    .find(locators[loc + "Clickable"]).click()

            } else if (loc.includes("Msg") || loc.includes("ContainsText")) {
                cy.get(Locs[loc]).should("have.text", data[loc])

            } else if (loc.includes("NotInDOM")) {
                cy.get(Locs[loc]).should("not.exist")

            } else if (loc.includes("Evaluated")) {
                cy.get(Locs[loc]).should("have.value", data[loc])

            } else if (loc.includes("@")) {
                cy.wait(loc).its('response.statusCode').should('eq', Locs[loc])

            } else if (loc.includes("AppendStart")) {
                cy.get(Locs[loc])
                    .type(`{${modifierKey}}{home}`).type(" ")
                    .type(`{${modifierKey}}{home}`).type("-")
                    .type(`{${modifierKey}}{home}`).type(" ")
                    .type(`{${modifierKey}}{home}`).type("d")
                    .type(`{${modifierKey}}{home}`).type("r")
                    .type(`{${modifierKey}}{home}`).type("a")
                    .type(`{${modifierKey}}{home}`).type("k")
            } else {
                cy.get(Locs[loc]).clear()
                cy.get(Locs[loc]).type(data[loc])
            }
        }
    })
}

function submitOperation(operation, fieldsType, type) {
    let locators = getLocators(fieldsType)
    let Locs = locators[operation]
    cy.fixture(fieldsType + "_data").then(returnedData => {
        let data = returnedData[operation]
        for (let loc in Locs) {
            if (loc.includes("FieldLabel")) {
                cy.get(Locs[loc]["mandatorySign"]).each((col, index, list) =>
                    cy.wrap(col).parents(Locs[loc]["parentElement"]).find(Locs[loc]["fieldLabel"]).should("have.css", "color", getColor(type))
                )

            } else {
                cy.get(Locs[loc]).clear()
                cy.get(Locs[loc]).type(data[loc])

                // if (fieldsType == "exceedingCharaterLimits" || fieldsType == "invalidData") {
                //     cy.get(Locs[loc]).parent().parent().find(commonLocators.validationError).invoke("text").then(errorText => {
                //         expect(ChangeThisParam.errorMessages).to.be.include(errorText)
                //         if (fieldsType == "exceedingCharaterLimits") {
                //             cy.get(Locs[loc]).type("{backspace}")
                //         } else {
                //             cy.get(Locs[loc]).clear()
                //             cy.get(Locs[loc]).type(ChangeThisParam["validData"][fields][loc])
                //         }

                //         cy.get(Locs[loc]).parent().parent().find(commonLocators.validationError).should("not.exist")
                //     })
                // }
            }
        }
    })
}

function readOperation(operation, fieldsType) {
    let locators = getLocators(fieldsType)
    let Locs = locators[operation]
    cy.fixture(fieldsType + "_data").then(returnedData => {
        let data = returnedData[operation]
        for (let loc in Locs) {
            if (loc.includes("InputField")) {
                cy.get(Locs[loc]["input"]).invoke("val").then(inputValue => {
                    cy.get(Locs[loc]["value"])
                        .eq(data[loc])
                        .should("contain", inputValue)
                })

            } else if (loc.includes("LabelField")) {
                cy.get(Locs[loc]["label"]).invoke("text").then(labelValue => {
                    cy.get(Locs[loc]["value"])
                        .eq(data[loc])
                        .should("contain", labelValue)
                })

            } else if (loc.includes("Msg")) {
                cy.get(Locs[loc]).should("have.text", data[loc])

            } else if (loc.includes("NotInDOM")) {
                cy.get(Locs[loc]).should("not.exist")

            } else if (loc.includes("BeInDOM")) {
                cy.get(Locs[loc]).should("exist")

            } else if (loc.includes("BeVisible")) {
                cy.get(Locs[loc]).should("be.visible")

            } else if (loc.includes("Evaluated")) {
                cy.get(Locs[loc]).should("have.value", data[loc])

            } else if (loc.includes("@")) {
                cy.wait(loc).its('response.statusCode').should('eq', Locs[loc])

            } else {
                cy.get(Locs[loc]).invoke("text").then(copy => {
                    expect(copy).to.equal(data[loc])
                })
            }
        }
    })
}

Given("The user is logged in successfully.", () => {
    cy.get(commonLocators.sideNavMenu).should("be.visible")
})

Then("the {string} validation error should appear.", (validationError) => {
    cy.get(commonLocators.validationError).contains(validationError).should("have.text", validationError)
})

Then("the {string} validation error should appear against phone number field.", (validationError) => {
    cy.get(commonLocators.phoneValidationError).should("have.text", validationError)
})

Given("The user is on Dashboard.", () => {
    // cy.wait(5000)
    cy.visit("/dashboard")
    // Click Get Started button to open form
    cy.get(dashboardLocators.dashboardHeading).should("have.text", "Dashboard")
})

When("the user navigates to the {string} screen via {string}.", (subScreen, screen) => {
    cy.get(commonLocators.menuBtn).contains(screen).click()
    cy.get(commonLocators.subMenuBtn).contains(subScreen).click({ force: true })
})

When("the user navigates to the {string} screen.", (screen) => {
    cy.get(commonLocators.menuBtn).contains(screen).click()
})

Then("The user should be moved to the {string}.", (screen) => {
    cy.get(commonLocators.pageHeading).should("contain", screen)
})

When("the user {string} a {string}.", (operation, fieldsType) => {
    createOperation(operation, fieldsType)
})

When("the user adds {string} at the {string} screen.", (operation, fieldsType) => {
    createOperation(operation, fieldsType)
})

When("the user {string} at the {string}.", (operation, fieldsType) => {
    // cy.get("textarea#notes").type(`{${modifierKey}}w`)
    createOperation(operation, fieldsType)
})

Then("the {string} of the created {string} should be correct.", (operation, fieldsType) => {
    readOperation(operation, fieldsType)
})

When("the user hits {string} without submitting mandatory fields at the {string} step.", (operation, fieldsType) => {
    let locators = getLocators(fieldsType)

    cy.get(locators[operation + "Btn"]).click()

    submitOperation(operation, fieldsType, "invalid")
})

When("the user hits {string} with submitting all mandatory fields at the {string} step.", (operation, fieldsType) => {
    let locators = getLocators(fieldsType)

    cy.get(locators[operation + "Btn"]).click()

    submitOperation(operation, fieldsType, "valid")
})

Then("the {string} should be created successfully.", (fieldsType) => {
    cy.fixture(fieldsType + "_data").then(returnedData => {
        // Storing name for future records create operation
        cy.getUniqueName(returnedData.creates[fieldsType.toLowerCase() + "Name"], fieldsType).then(newName => {
            returnedData.creates[fieldsType.toLowerCase() + "Name"] = newName
            returnedData.details[fieldsType.toLowerCase() + "Name"] = newName
            cy.writeFile("cypress/fixtures/" + fieldsType + "_data.json", JSON.stringify(returnedData))
        })
    })
})