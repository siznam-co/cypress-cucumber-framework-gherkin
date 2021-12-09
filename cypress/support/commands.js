/// <reference types="Cypress" />

import 'cypress-mailosaur'

const commonLocators = require("../Locators/commonLocators.json")
const SignInLocators = require("../Locators/SignInLocators.json")
const UserLocators = require("../Locators/UserLocators.json")
const TeamLocators = require("../Locators/TeamLocators.json")
const TemplateLocators = require("../Locators/TemplateLocators.json")
const ChecklistLocators = require("../Locators/ChecklistLocators.json")

let LOCAL_STORAGE_MEMORY = {};

const modifierKey = Cypress.platform === "darwin" ? "meta" : "ctrl";

// Below github uuid is unique during execution globally and use it for all user, team, templates, checklist, inventory etc operations.
window.uniqueId = generateUUID()

export function generateUUID() {
    const uuid = require("uuid")
    const id = uuid.v4()
    return id.split("-")[4]
}

export function generateFullUUID() {
    const uuid = require("uuid")
    const id = uuid.v4()
    return id
}

export function getColor(type) {
    switch (type) {
        case "valid":
            return "rgb(4, 9, 48)"
        case "invalid":
            return "rgb(255, 130, 130)"
        case "validBorder":
            return "rgb(219, 220, 221)"
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

export function convertedDateForm(date) {
    //  "11/09/2025"
    let allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let month = parseInt(date.split("/")[0])
    let day = date.split("/")[1]
    let year = date.split("/")[2]

    let computedMonth = allMonths[month - 1]

    return computedMonth + " " + day + " " + year // Nov 09 2025
}

Cypress.Commands.add("enterUniqueName", (locator, value) => {
    cy.get(locator).clear()
    cy.get(locator).type(getUniqueName(value))
})

Cypress.Commands.add("enterUniqueEmail", (locator, value) => {
    cy.get(locator).clear()
    cy.get(locator).type(getUniqueEmail(value))
})

Cypress.Commands.add("readUniqueName", (locator, value) => {
    cy.get(locator).invoke("text").then(copy => {
        expect(copy).to.equal(getUniqueName(value))
    })
})

Cypress.Commands.add("readUniqueEmail", (locator, value) => {
    cy.get(locator).invoke("text").then(copy => {
        expect(copy).to.equal(getUniqueEmail(value))
    })
})

Cypress.Commands.add("selectFromDropdown", (dropdown, value, type) => {

    if (type.includes("MultipleSelect")) {

        cy.get(dropdown["dropdown"]).click({ force: true })
        cy.get(dropdown["input"]).type(value)
        cy.get(dropdown["options"]).each((col, index, list) => {
            if (index >= 3)
                return
            cy.wrap(col).click({ force: true })
        })
        cy.get(dropdown["dropdown"]).click({ force: true })

    } else {

        cy.get(dropdown["dropdown"]).click()
        if (type.includes("_UNIQUE")) {
            cy.get(dropdown["input"]).type(getUniqueName(value))
            cy.get(dropdown["options"]).eq(0).click()
        } else {
            cy.get(dropdown["input"]).type(value, { force: true })
            cy.get(dropdown["options"]).contains(value).click()
        }
    }
})

Cypress.Commands.add("selectFromInputDropdown", (locatorObject, value) => {
    cy.get(locatorObject["dropdown"]).click()
    cy.get(locatorObject["input"]).type(value)
    cy.get(locatorObject["option"]).each((col, index, list) => {
        cy.wrap(col).invoke("text").then(optionText => {
            if (optionText != value && list.length == index + 1) {
                cy.get(locatorObject["input"]).type("{enter}")
            } else if (optionText == value) {
                cy.wrap(col).click()
            }
        })
    })
})

Cypress.Commands.add("elementMultipleClicks", (selector, i) => {
    while (i != 0) {
        cy.get(selector).click({ force: true, multiple: true })
        i = i - 1
    }
})

Cypress.Commands.add("assertTextErrorMessage", (selector, data) => {
    cy.get(selector["field"])
        .parents(selector["parentElement"])
        .find(selector["errorMessage"])
        .should("have.text", data["errorMessage"])
})

Cypress.Commands.add("assertBorderError", (selector, type) => {
    cy.get(selector).each((col, index, list) => {
        cy.wrap(col)
            .parent()
            .should("have.css", "border-color", getColor(type))
    })
})

Cypress.Commands.add("assertMandatoryFieldLabelError", (selector, type) => {
    cy.get(selector["mandatorySign"]).each((col, index, list) => {
        cy.wrap(col)
            .parents(selector["parentElement"])
            .find(selector["fieldLabel"])
            .should("have.css", "color", getColor(type))
    })

})

Cypress.Commands.add("enterMultipleInputs", (selector, data) => {
    cy.get(selector).each((col, index, list) => {
        cy.wrap(col).clear()
        cy.wrap(col).type(data + numToWords(index + 1))
    })
})

Cypress.Commands.add("saveLocalStorage", () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key]
    })
})

Cypress.Commands.add("restoreLocalStorage", () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
});

Cypress.Commands.add("loginWithApi", (username, password) => {

    cy.request({
        method: "POST",
        url: "/api/auth/login",
        headers: {
            "Host": Cypress.config().baseUrl.split("//")[1],
            "Connection": "keep-alive",
            "Accept": "application/json, text/plain, */*",
            // "Authorization": "Bearer undefined",
            "Origin": "/",
            "Referer": "/login",
        },
        followRedirect: true,
        form: false,
        body: {
            "email": username,
            "password": password,
            "localeId": "en"
        }
    }).then((response) => {
        expect(response.status).equal(200)
        // Storing user Data in Cache
        cy.window().then((window) => {
            window.localStorage.setItem("profile", JSON.stringify(response.body))
            window.localStorage.setItem("i18nextLng", "en")
            cy.log("The user logged in successfully")
            cy.visit("/")
            cy.get(commonLocators.sideNavMenu).should("be.visible")
        })
    })
})

Cypress.Commands.add("loginWithUI", (username, password) => {
    cy.visit("/login")
    // Check if the user is on the login page. 
    cy.get(SignInLocators.emailField).should("be.visible")

    // Enter credentials and log in.
    cy.get(SignInLocators.emailField).type(username)
    cy.get(SignInLocators.passwordField).type(password)
    cy.get(SignInLocators.rememberCheckBox).click()

    cy.get(SignInLocators.submitButton).click()
})

Cypress.Commands.add("createUsersUsingApi", () => {
    let userID = generateFullUUID()

    cy.fixture("Users").then(newUser => {
        for (let user in newUser) {
            newUser[user]["id"] = userID
            let name = newUser[user]["userName"]
            cy.log(newUser[user]["userName"])
            let profileData = window.localStorage.getItem("profile")
            let token = JSON.parse(profileData)["token"]
            let cookiesArr = ""
            cy.getCookies()
                .then((cookies) => {
                    for (let cookie in cookies) {
                        cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
                    }

                    cy.request({
                        method: "POST",
                        url: "/api/User/list",
                        headers: {
                            "Host": Cypress.config().baseUrl.split("//")[1],
                            "Connection": "keep-alive",
                            "Accept": "application/json, text/plain, */*",
                            "Authorization": "Bearer " + token,
                            "Origin": Cypress.config().baseUrl,
                            "Referer": Cypress.config().baseUrl + "/users",
                            "cookie": cookiesArr
                        },
                        body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
                    }).then((response) => {
                        expect(response.status).equal(200)
                        if (response.body.totalCount == 0) {
                            cy.request({
                                method: "POST",
                                url: "/api/user",
                                headers: {
                                    "Host": Cypress.config().baseUrl.split("//")[1],
                                    "Connection": "keep-alive",
                                    "Accept": "application/json, text/plain, */*",
                                    "Authorization": "Bearer " + token,
                                    "Origin": Cypress.config().baseUrl,
                                    "Referer": Cypress.config().baseUrl + "/templates/add",
                                    "cookie": cookiesArr
                                },
                                body: newUser[user]
                            }).then((response) => {
                                expect(response.status).equal(200)
                            })
                        } else {
                            cy.log("This User is already created.")
                        }
                    })

                })
        }
    })
})

Cypress.Commands.add("assertUser", (name, operation) => {

    let profileData = window.localStorage.getItem("profile")
    let token = JSON.parse(profileData)["token"]
    let cookiesArr = ""
    cy.getCookies().then((cookies) => {
        for (let cookie in cookies) {
            cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
        }

        cy.request({
            method: "POST",
            url: "/api/User/list",
            headers: {
                "Host": Cypress.config().baseUrl.split("//")[1],
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "Authorization": "Bearer " + token,
                "Origin": Cypress.config().baseUrl,
                "Referer": Cypress.config().baseUrl + "/users",
                "cookie": cookiesArr
            },
            body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalCount).equal(operation)
        })

    })
})

Cypress.Commands.add("createTeamsUsingApi", () => {
    let TeamID = generateFullUUID()

    cy.fixture("Teams").then(newTeam => {
        newTeam.id = TeamID
        let name = newTeam.name
        let profileData = window.localStorage.getItem("profile")
        let token = JSON.parse(profileData)["token"]
        let cookiesArr = ""
        cy.getCookies()
            .then((cookies) => {
                for (let cookie in cookies) {
                    cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
                }

                // Create Users if not existed previously.
                cy.createUsersUsingApi()

                cy.request({
                    method: "POST",
                    url: "/api/User/list",
                    headers: {
                        "Host": Cypress.config().baseUrl.split("//")[1],
                        "Connection": "keep-alive",
                        "Accept": "application/json, text/plain, */*",
                        "Authorization": "Bearer " + token,
                        "Origin": Cypress.config().baseUrl,
                        "Referer": Cypress.config().baseUrl + "/users",
                        "cookie": cookiesArr
                    },
                    body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": "user_" }
                }).then((response) => {
                    expect(response.status).equal(200)

                    let allUsers = response.body.items
                    let selectedUsersIds = []

                    for (let user in allUsers) {
                        selectedUsersIds[user] = allUsers[user]["id"]
                    }
                    newTeam.userIds = selectedUsersIds

                    cy.request({
                        method: "POST",
                        url: "/api/team2/list",
                        headers: {
                            "Host": Cypress.config().baseUrl.split("//")[1],
                            "Connection": "keep-alive",
                            "Accept": "application/json, text/plain, */*",
                            "Authorization": "Bearer " + token,
                            "Origin": Cypress.config().baseUrl,
                            "Referer": Cypress.config().baseUrl + "/teams",
                            "cookie": cookiesArr
                        },
                        body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
                    }).then((response) => {
                        expect(response.status).equal(200)
                        if (response.body.totalCount == 0) {
                            cy.request({
                                method: "POST",
                                url: "/api/team2",
                                headers: {
                                    "Host": Cypress.config().baseUrl.split("//")[1],
                                    "Connection": "keep-alive",
                                    "Accept": "application/json, text/plain, */*",
                                    "Authorization": "Bearer " + token,
                                    "Origin": Cypress.config().baseUrl,
                                    "Referer": Cypress.config().baseUrl + "teams/add",
                                    "cookie": cookiesArr
                                },
                                body: newTeam
                            }).then((response) => {
                                expect(response.status).equal(200)
                            })
                        } else {
                            cy.log("This Team is already created.")
                        }
                    })
                })
            })
    })
})

Cypress.Commands.add("assertTeam", (name, operation) => {

    let profileData = window.localStorage.getItem("profile")
    let token = JSON.parse(profileData)["token"]
    let cookiesArr = ""
    cy.getCookies().then((cookies) => {
        for (let cookie in cookies) {
            cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
        }

        cy.request({
            method: "POST",
            url: "/api/team2/list",
            headers: {
                "Host": Cypress.config().baseUrl.split("//")[1],
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "Authorization": "Bearer " + token,
                "Origin": Cypress.config().baseUrl,
                "Referer": Cypress.config().baseUrl + "/teams",
                "cookie": cookiesArr
            },
            body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalCount).equal(operation)
        })

    })
})

Cypress.Commands.add("assertEquipment", (name, operation) => {

    let profileData = window.localStorage.getItem("profile")
    let token = JSON.parse(profileData)["token"]
    let cookiesArr = ""
    cy.getCookies().then((cookies) => {
        for (let cookie in cookies) {
            cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
        }

        cy.request({
            method: "POST",
            url: "/api/equipment2/list",
            headers: {
                "Host": Cypress.config().baseUrl.split("//")[1],
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "Authorization": "Bearer " + token,
                "Origin": Cypress.config().baseUrl,
                "Referer": Cypress.config().baseUrl + "/equipment/add",
                "cookie": cookiesArr
            },
            body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalCount).equal(operation)
        })

    })
})

Cypress.Commands.add("assertCustomer", (name, operation) => {

    let profileData = window.localStorage.getItem("profile")
    let token = JSON.parse(profileData)["token"]
    let cookiesArr = ""
    cy.getCookies().then((cookies) => {
        for (let cookie in cookies) {
            cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
        }

        cy.request({
            method: "POST",
            url: "/api/customer/list",
            headers: {
                "Host": Cypress.config().baseUrl.split("//")[1],
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "Authorization": "Bearer " + token,
                "Origin": Cypress.config().baseUrl,
                "Referer": Cypress.config().baseUrl + "/customers",
                "cookie": cookiesArr
            },
            body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalCount).equal(operation)
        })

    })
})

Cypress.Commands.add("assertSupplier", (name, operation) => {

    let profileData = window.localStorage.getItem("profile")
    let token = JSON.parse(profileData)["token"]
    let cookiesArr = ""
    cy.getCookies().then((cookies) => {
        for (let cookie in cookies) {
            cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
        }

        cy.request({
            method: "POST",
            url: "/api/supplier/list",
            headers: {
                "Host": Cypress.config().baseUrl.split("//")[1],
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "Authorization": "Bearer " + token,
                "Origin": Cypress.config().baseUrl,
                "Referer": Cypress.config().baseUrl + "/suppliers",
                "cookie": cookiesArr
            },
            body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalCount).equal(operation)
        })

    })
})

Cypress.Commands.add("assertItem", (name, operation) => {

    let profileData = window.localStorage.getItem("profile")
    let token = JSON.parse(profileData)["token"]
    let cookiesArr = ""
    cy.getCookies().then((cookies) => {
        for (let cookie in cookies) {
            cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
        }

        cy.request({
            method: "POST",
            url: "/api/item/list",
            headers: {
                "Host": Cypress.config().baseUrl.split("//")[1],
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "Authorization": "Bearer " + token,
                "Origin": Cypress.config().baseUrl,
                "Referer": Cypress.config().baseUrl + "/items",
                "cookie": cookiesArr
            },
            body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalCount).equal(operation)
        })

    })
})

Cypress.Commands.add("assertTemplate", (name, operation) => {

    let profileData = window.localStorage.getItem("profile")
    let token = JSON.parse(profileData)["token"]
    let cookiesArr = ""
    cy.getCookies().then((cookies) => {
        for (let cookie in cookies) {
            cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
        }

        cy.request({
            method: "POST",
            url: "/api/template/list",
            headers: {
                "Host": Cypress.config().baseUrl.split("//")[1],
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "Authorization": "Bearer " + token,
                "Origin": Cypress.config().baseUrl,
                "Referer": Cypress.config().baseUrl + "/items",
                "cookie": cookiesArr
            },
            body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "keywordSearch": name }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalCount).equal(operation)
        })

    })
})

Cypress.Commands.add("createTemplateUsingApi", () => {
    let templateId = generateFullUUID()
    let workflowVersionId = generateFullUUID()
    // Enable below when asserting the checklish with all steps and activities. Edit the Checklist_data.json file too.
    // let name = "Unique_Template_Ampliflow"
    let name = "Template_2"
    let step1Id = generateFullUUID()
    let step2Id = generateFullUUID()
    let step3Id = generateFullUUID()

    cy.fixture("Templates").then(newTemplate => {
        newTemplate.id = templateId
        newTemplate.workflowVersionId = workflowVersionId
        newTemplate.name = name
        newTemplate["stepRequests"][0]["id"] = step1Id
        // newTemplate["stepRequests"][1]["id"] = step2Id
        // newTemplate["stepRequests"][2]["id"] = step3Id
        // newTemplate.selectedStepIds = [step1Id, step2Id, step3Id]

        let profileData = window.localStorage.getItem("profile")
        let token = JSON.parse(profileData)["token"]
        let cookiesArr = ""
        cy.getCookies()
            .then((cookies) => {
                for (let cookie in cookies) {
                    cookiesArr = cookiesArr + cookies[cookie]["name"] + "=" + cookies[cookie]["value"] + "; "
                }

                cy.request({
                    method: "POST",
                    url: "/api/template/list",
                    headers: {
                        "Host": Cypress.config().baseUrl.split("//")[1],
                        "Connection": "keep-alive",
                        "Accept": "application/json, text/plain, */*",
                        "Authorization": "Bearer " + token,
                        "Origin": Cypress.config().baseUrl,
                        "Referer": Cypress.config().baseUrl + "/templates",
                        "cookie": cookiesArr
                    },
                    body: { "page": 1, "pageSize": 10, "sortBy": 1, "sortAsc": true, "showDrafts": true, "keywordSearch": name }
                }).then((response) => {
                    expect(response.status).equal(200)
                    if (response.body.totalCount == 0) {
                        cy.request({
                            method: "POST",
                            url: "/api/template",
                            headers: {
                                "Host": Cypress.config().baseUrl.split("//")[1],
                                "Connection": "keep-alive",
                                "Accept": "application/json, text/plain, */*",
                                "Authorization": "Bearer " + token,
                                "Origin": Cypress.config().baseUrl,
                                "Referer": Cypress.config().baseUrl + "/templates/add",
                                "cookie": cookiesArr
                            },
                            body: newTemplate
                        }).then((response) => {
                            expect(response.status).equal(200)
                        })
                        // for (let step in newTemplate.stepRequests) {
                        //     cy.request({
                        //         method: "POST",
                        //         url: "/api/step/validate",
                        //         headers: {
                        //             "Host": Cypress.config().baseUrl.split("//")[1],
                        //             "Connection": "keep-alive",
                        //             "Accept": "application/json, text/plain, */*",
                        //             "Authorization": "Bearer " + token,
                        //             "Origin": Cypress.config().baseUrl,
                        //             "cookie": cookiesArr
                        //         },
                        //         body: newTemplate.stepRequests[step]
                        //     }).then((response) => {
                        //         expect(response.status).equal(200)
                        //         if (step == 2) {
                        //             cy.wait(5000)
                        //             cy.request({
                        //                 method: "POST",
                        //                 url: "/api/template",
                        //                 headers: {
                        //                     "Host": Cypress.config().baseUrl.split("//")[1],
                        //                     "Connection": "keep-alive",
                        //                     "Accept": "application/json, text/plain, */*",
                        //                     "Authorization": "Bearer " + token,
                        //                     "Origin": Cypress.config().baseUrl,
                        //                     "Referer": Cypress.config().baseUrl + "/templates/add",
                        //                     "cookie": cookiesArr
                        //                 },
                        //                 body: newTemplate.create
                        //             }).then((response) => {
                        //                 expect(response.status).equal(200)
                        //             })
                        //         }
                        //     })
                        // }
                    } else {
                        cy.log("The template is already created.")
                    }
                })

            })

    })
})

Cypress.Commands.add("runRoutes", () => {

    cy.intercept("POST", "/api/user").as("createUser")
    cy.intercept("PUT", "/api/user").as("updateUser")
    cy.intercept("POST", "/api/user/archive").as("disableUser")

    cy.intercept("POST", "/api/team2").as("createTeam")
    cy.intercept("PUT", "/api/team2").as("updateTeam")
    cy.intercept("DELETE", "/api/team2/*").as("deleteTeam")

    cy.intercept("POST", "/api/step/validate").as("createStep")
    cy.intercept("POST", "/api/stepinstance/finalize").as("finalizeStep")
    cy.intercept("POST", "/api/attachment/validate").as("addAttachment")

    cy.intercept("POST", "/api/template").as("createTemplate")
    cy.intercept("PUT", "/api/template").as("updateTemplate")
    cy.intercept("DELETE", "/api/template/*").as("deleteTemplate")
    cy.intercept("GET", "/api/team/published").as("publishTemplate")
    cy.intercept("POST", "/api/template/list").as("searchTemplate")

    cy.intercept("POST", "/api/workflowRun/quick-run").as("createChecklist")
    cy.intercept("GET", "/api/step/by-workflow/").as("addTemplateToChecklist")

    cy.intercept("POST", "/api/equipment2").as("createEquipment")
    cy.intercept("PUT", "/api/equipment2").as("updateEquipment")
    cy.intercept("DELETE", "/api/equipment2/*").as("deleteEquipment")

    cy.intercept("POST", "/api/customer").as("createCustomer")
    cy.intercept("PUT", "/api/customer").as("updateCustomer")
    cy.intercept("DELETE", "/api/customer/*").as("deleteCustomer")

    cy.intercept("POST", "/api/supplier").as("createSupplier")
    cy.intercept("PUT", "/api/supplier").as("updateSupplier")
    cy.intercept("DELETE", "/api/supplier/*").as("deleteSupplier")

    cy.intercept("POST", "/api/item").as("createItem")
    cy.intercept("PUT", "/api/item").as("updateItem")
    cy.intercept("DELETE", "/api/item/*").as("deleteItem")
    cy.intercept("POST", "/api/item/list").as("searchItems")

    cy.intercept("GET", "/api/user/published-by-team").as("waitForCharts")
    cy.intercept("GET", "/api/deviation/process-chart-count/*").as("processChartCount")
    //  cy.get("GET", "/api/deviation/process-chart-count?type=0&parentId=00000000-0000-0000-0000-000000000000&showDraft=true").as("Process")
})