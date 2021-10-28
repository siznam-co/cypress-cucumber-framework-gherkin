/// <reference types="Cypress" />

import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps"
import "cypress-file-upload"

const commonLocators = require("../../Locators/commonLocators.json")
const UserLocators = require("../../Locators/UserLocators.json")
const TeamLocators = require("../../Locators/TeamLocators.json")
const TemplateLocators = require("../../Locators/TemplateLocators.json")
const ChecklistLocators = require("../../Locators/ChecklistLocators.json")

const modifierKey = Cypress.platform === "darwin" ? "meta" : "ctrl";

// Below github uuid is unique during execution globally and use it for all user, team, templates, checklist, inventory etc operations.
window.uniqueId = generateUUID()

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

function generateUUID() {
    const uuid = require("uuid")
    const id = uuid.v4()
    return id.split("-")[4]
}

export function generateFullUUID() {
    const uuid = require("uuid")
    const id = uuid.v4()
    return id
}

function getColor(type) {
    switch (type) {
        case "valid":
            return "rgb(4, 9, 48)"
        case "invalid":
            return "rgb(255, 130, 130)"
    }
}

function numToWords(num) {
    var a = ["", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ", "twelve ", "thirteen ", "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen "];
    var b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    if ((num = num.toString()).length > 9) return "overflow"
    let n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!n) return; var str = ""
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore " : ""
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh " : ""
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand " : ""
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred " : ""
    str += (n[5] != 0) ? ((str != "") ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) : ""
    return str.trim()
}

export function getUniqueName(previousName) {   // theqa13119+User1
    let firstHalf = previousName.split("_")[0]
    let newName = firstHalf + "_" + window.uniqueId    // theqa13119 + '+' + asdj23j 
    return newName
}

export function getUniqueEmail(previousEmail) { // theqa13119+User1@gmail.com
    let firstHalf = previousEmail.split("+")[0]                   // theqa13119
    let secondHalf = previousEmail.split("@")[1]                      // gmail.com
    let newEmail = firstHalf + "+" + window.uniqueId + "@" + secondHalf    // theqa13119 + '+' + 23jkq3jkbf + '@' + gmail.com
    return newEmail
}

export function getAfterValue(selector, pseudo, property) {
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
}

export function getbBeforeORAfterValue(selector, pseudo, property, expectedColor) {
    cy.get(selector).then($els => {
        // get Window reference from element
        const win = $els[0].ownerDocument.defaultView
        // use getComputedStyle to read the pseudo selector
        const cssSelector = win.getComputedStyle($els[0], pseudo)
        // read the value of the `content` CSS property
        const contentValue = cssSelector.getPropertyValue(property)
        // the returned value will have double quotes around it, but this is correct
        expect(contentValue).to.eq(expectedColor)
    })
}

export function createOperation(operation, fieldsType) {
    let locators = getLocators(fieldsType)
    let Locs = locators[operation]
    cy.fixture(fieldsType + "_data").then(returnedData => {
        let data = returnedData[operation]
        for (let loc in Locs) {
            if (loc.includes("Checkbox")) {
                cy.get(Locs[loc]).each((col, index, list) => {
                    cy.wrap(col).click()
                })

            } else if (loc.includes("MultipleSelect")) {

                cy.get(Locs[loc]["dropdown"]).click()
                cy.get(Locs[loc]["input"]).type(data[loc])
                cy.get(Locs[loc]["options"]).each((col, index, list) => {
                    if (index >= 3)
                        return
                    cy.wrap(col).click({ force: true })
                })
                cy.get(Locs[loc]["dropdown"]).click()

            } else if (loc.includes("SingleSelect")) {

                cy.get(Locs[loc]["dropdown"]).click()
                if (loc.includes("_UNIQUE")) {
                    cy.get(Locs[loc]["input"]).type(getUniqueName(data[loc]))
                    cy.get(Locs[loc]["options"]).eq(0).click()
                } else { 
                    cy.get(Locs[loc]["input"]).type(data[loc])
                    cy.get(Locs[loc]["options"]).eq(0).click()
                }
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

            } else if (loc.includes("MultipleClicks")) {
                var i = data[loc]
                while (i != 0) {
                    cy.get(Locs[loc]).click({ force: true, multiple: true })
                    i = i - 1
                }

            } else if (loc.includes("MultipleButton")) {
                cy.get(Locs[loc]).each((col, index, list) => {
                    cy.wrap(col).click({ force: true })
                })

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
                cy.wait(loc).its("response.statusCode").should("eq", Locs[loc])

            } else if (loc.includes("MultipleInputs")) {
                cy.get(Locs[loc]).each((col, index, list) => {
                    cy.wrap(col).clear()
                    cy.wrap(col).type(data[loc] + numToWords(index + 1))
                })
            } else if (loc.includes("_UNIQUE")) {
                cy.get(Locs[loc]).clear()
                if (loc.includes("Name")) {
                    cy.get(Locs[loc]).type(getUniqueName(data[loc]))
                } else {
                    cy.get(Locs[loc]).type(getUniqueEmail(data[loc]))
                }
            } else {
                cy.get(Locs[loc]).clear()
                cy.get(Locs[loc]).type(data[loc])
            }
        }
    })
}

export function submitOperation(operation, fieldsType, type) {
    let locators = getLocators(fieldsType)
    let Locs = locators[operation]
    cy.fixture(fieldsType + "_data").then(returnedData => {
        let data = returnedData[operation]
        for (let loc in Locs) {
            if (loc.includes("FieldLabel")) {
                cy.get(Locs[loc]["mandatorySign"]).each((col, index, list) => {
                    cy.wrap(col)
                        .parents(Locs[loc]["parentElement"])
                        .find(Locs[loc]["fieldLabel"])
                        .should("have.css", "color", getColor(type))
                })

            } else if (loc.includes("BorderError")) {
                cy.get(Locs[loc]).each((col, index, list) => {
                    cy.wrap(col)
                        .parent()
                        .should("have.css", "border-color", getColor(type))
                })

            } else if (loc.includes("TextErrorMessage")) {
                cy.get(Locs[loc]["field"]).each((col, index, list) => {
                    cy.wrap(col)
                        .parents(Locs[loc]["parentElement"])
                        .find(Locs[loc]["errorMessage"])
                        .should("have.text", data[loc]["errorMessage"])
                    expect(index).to.be.lessThan(data[loc]["field"])
                })

            } else if (loc.includes("@")) {
                cy.wait(loc).its("response.statusCode").should("eq", Locs[loc])

            } else if (loc.includes("Msg")) {
                cy.get(Locs[loc]).should("have.text", data[loc])

            } else if (loc.includes("NotInDOM")) {
                cy.get(Locs[loc]).should("not.exist")

            } else if (loc.includes("BeVisible")) {
                cy.get(Locs[loc]).should("be.visible")

            } else {
                if (fieldsType == "exceedingCharaterLimits" || fieldsType == "invalidData") {
                    cy.get(Locs[loc]).parent().parent().find(commonLocators.validationError).invoke("text").then(errorText => {
                        expect(ChangeThisParam.errorMessages).to.be.include(errorText)
                        if (fieldsType == "exceedingCharaterLimits") {
                            cy.get(Locs[loc]).type("{backspace}")
                        } else {
                            cy.get(Locs[loc]).clear()
                            cy.get(Locs[loc]).type(ChangeThisParam["validData"][fields][loc])
                        }

                        cy.get(Locs[loc]).parent().parent().find(commonLocators.validationError).should("not.exist")
                    })
                }
            }
        }
    })
}

export function readOperation(operation, fieldsType) {
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

            } else if (loc.includes("BeDisabled")) {
                cy.get(Locs[loc]).should("be.disabled")

            } else if (loc.includes("Evaluated")) {
                cy.get(Locs[loc]).should("have.value", data[loc])

            } else if (loc.includes("@")) {
                cy.wait(loc).its("response.statusCode").should("eq", Locs[loc])

            } else if (loc.includes("_UNIQUE")) {
                cy.get(Locs[loc]).invoke("text").then(copy => {
                    if (loc.includes("Name"))
                        expect(copy).to.equal(getUniqueName(data[loc]))
                    else
                        expect(copy).to.equal(getUniqueEmail(data[loc]))
                })
            } else {
                cy.get(Locs[loc]).invoke("text").then(copy => {
                    expect(copy).to.equal(data[loc])
                })
            }
        }
    })
}

Given("the user is logged in successfully.", () => {
    cy.get(commonLocators.sideNavMenu).should("be.visible")
})

Then("the {string} validation error should appear.", (validationError) => {
    cy.get(commonLocators.validationError).contains(validationError).should("have.text", validationError)
})

Then("the {string} validation error should appear against phone number field.", (validationError) => {
    cy.get(commonLocators.phoneValidationError).should("have.text", validationError)
})

When("the user navigates to the {string} screen via {string}.", (subScreen, screen) => {
    cy.get(commonLocators.menuBtn).contains(screen).click()
    cy.get(commonLocators.subMenuBtn).contains(subScreen).click({ force: true })
})

When("the user navigates to the {string} screen.", (screen) => {
    cy.get(commonLocators.menuBtn).contains(screen).click()
})

Then("the user should be moved to the {string}.", (screen) => {
    cy.get(commonLocators.pageHeading).should("contain", screen)
})

Then("the {string} operation should be successful for the {string}.", (operation, fieldsType) => {
    cy.wait("@" + operation).its("response.statusCode").should("eq", 200)
})

When("the user hits the {string} button at {string} screen.", (btn, btnType) => {
    let locators = getLocators(btnType)
    cy.get(locators[btn]).click()
})