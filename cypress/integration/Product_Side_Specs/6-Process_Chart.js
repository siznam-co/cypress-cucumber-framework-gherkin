/// <reference types="Cypress" />
require('@4tw/cypress-drag-drop')

const commonLocators = require("../../Locators/commonLocators.json")
const ProcessChartLocators = require("../../Locators/ProcessChartLocators.json")

describe("Create and run new Checklist.", () => {
    before(() => {

        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Process Chart").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Process Chart")
        // create Teams Using Api if not already exists.
        // cy.createTeamsUsingApi()
        cy.wait("@waitForCharts").its("response.statusCode").should("eq", 200)
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Create a Process chart", () => {
        cy.fixture("ProcessChart_data").then(data => {

            cy.get(ProcessChartLocators.EditBtn).click()
            cy.get(ProcessChartLocators.EditBtn).invoke("text").then(editBtnText => {
                let isClicked = true
                while (isClicked) {
                    if (editBtnText == "Edit") {
                        cy.get(ProcessChartLocators.EditBtn).click()
                    } else {
                        isClicked = false
                    }
                }
cy.get(ProcessChartLocators.ForEmpty).click({ multiple: true })
                cy.get(ProcessChartLocators.NewSupport1).eq(0).clear().type(data.CreatesAll.NewSupport1)
                cy.get(ProcessChartLocators.NewSupport2).clear().type(data.CreatesAll.NewSupport2)
                cy.get(ProcessChartLocators.NewSupport3).clear().type(data.CreatesAll.NewSupport3)
                cy.get(ProcessChartLocators.NewSupport4).clear().type(data.CreatesAll.NewSupport4)
                cy.get(ProcessChartLocators.NewSupport5).clear().type(data.CreatesAll.NewSupport5)
                cy.get(ProcessChartLocators.NewSupport6).clear().type(data.CreatesAll.NewSupport6)

                cy.get(ProcessChartLocators.ScopeOfManagementSystem).click()

                cy.get(ProcessChartLocators.What).clear().type(data.CreatesAll1.What)
                cy.get(ProcessChartLocators.Why).clear().type(data.CreatesAll1.Why)
                cy.get(ProcessChartLocators.Overview).clear().type(data.CreatesAll1.Overview)

                cy.selectFromDropdown(ProcessChartLocators.creates1.subProcessDropdown, data.creates1.addUsersMultipleSelect, "MultipleSelect")


                //click on the responsible user
                cy.get(ProcessChartLocators.Publish).click({ force: true })

                cy.get(ProcessChartLocators.Bold).contains("Ab process").parents(ProcessChartLocators.Parent).click({ force: true })
            })
        })
    })

    it("Create a Process chart", () => {
        cy.get(ProcessChartLocators.Bold).contains("Ab process").parents(ProcessChartLocators.Parent).click()

        cy.get(ProcessChartLocators.visible1).should('be.visible', { multiple: true })
        cy.get(ProcessChartLocators.EditClick).click()
        cy.get(ProcessChartLocators.visible1).should('be.visible', { multiple: true })

        //For to create a risks with fixture

        cy.fixture("ProcessChart_data").then(data => {
            cy.get(ProcessChartLocators.FortoDelete).click({ multiple: true })
            cy.get(ProcessChartLocators.ForEmpty1).click({ multiple: true })
            cy.get(ProcessChartLocators.IdentityRiskBtn).eq(0).click()
            cy.get(ProcessChartLocators.IdentityRisk).eq(0).clear().type(data.IdentityRisks.IdentityRisks1)
            cy.get(ProcessChartLocators.IdentityRiskBtn).eq(0).click()
            cy.get(ProcessChartLocators.IdentityRisk).eq(1).clear().type(data.IdentityRisks.IdentityRisks2)
            cy.get(ProcessChartLocators.IdentityRiskBtn).eq(0).click()
            cy.get(ProcessChartLocators.IdentityRisk).eq(2).clear().type(data.IdentityRisks.IdentityRisks3)

            cy.get(ProcessChartLocators.IdentityRiskBtn).eq(1).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(3).clear().type(data.IdentityTarget.IdentityTarget1)
            cy.get(ProcessChartLocators.IdentityRiskBtn).eq(1).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(4).clear().type(data.IdentityTarget.IdentityTarget2)
            cy.get(ProcessChartLocators.IdentityRiskBtn).eq(1).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(5).clear().type(data.IdentityTarget.IdentityTarget3)

            cy.get(ProcessChartLocators.InputBtn).eq(2).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(6).clear().type(data.IdentityTarget.Input1)
            cy.get(ProcessChartLocators.InputBtn).eq(3).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(7).clear().type(data.IdentityTarget.Input2)


            cy.get(ProcessChartLocators.InputBtn).eq(4).click()

            cy.selectFromDropdown(ProcessChartLocators.creates.subProcessDropdown, data.creates.subProcessDropdown, "SingleSelect")

            cy.get(ProcessChartLocators.Output_to).contains("Output to").parent().then(parentElement => {
                cy.wrap(parentElement).find(ProcessChartLocators.FindElement).click()
            
                cy.wrap(parentElement).find(ProcessChartLocators.creates2.subProcessDropdown["dropdown"]).click({ force: true })
                cy.wrap(parentElement).find(ProcessChartLocators.creates2.subProcessDropdown["input"]).type(data.creates.subProcessDropdown, { force: true })
                cy.wrap(parentElement).find(ProcessChartLocators.creates2.subProcessDropdown["options"]).contains(data.creates.subProcessDropdown).click()

                cy.get(ProcessChartLocators.IdentifyTarget2).clear().type(data.Identifiy.IdentifiyTarget2)

            })
          
            cy.selectFromDropdown(ProcessChartLocators.ResponsibleUser.RespUser, data.ResponsibleUser.addUsersMultipleSelect, "MultipleSelect")

            cy.selectFromDropdown(ProcessChartLocators.InvolvedTeams.Teams, data.InvolvedTeams.addUsersMultipleSelectTeam, "MultipleSelect")

         
            cy.get(ProcessChartLocators.MultipleType).each((elem, index, list) => {
                cy.wrap(elem).click()
                cy.get(ProcessChartLocators.SubProcessType).type(data.Identifiy.SubProcess)
                cy.get(ProcessChartLocators.SubProcessClick).eq(1).click()
            })


            cy.get(ProcessChartLocators.drag).drag(ProcessChartLocators.drop, {
                source: { deltax: 20, deltay: 20 }, // applies to the element being dragged
                target: { position: 'center' }, // applies to the drop target
                force: true, // applied to both the source and target element
            })

            //for other click
            cy.get(ProcessChartLocators.drag).drag(ProcessChartLocators.drop, {
                source: { x: 0, y: 0 }, // applies to the element being dragged
                target: { position: 'left' }, // applies to the drop target
                force: true, // applied to both the source and target element
            })
 
            cy.get(ProcessChartLocators.Publish).click({ force: true })
            cy.get(ProcessChartLocators.GoBack).click()

  
        })

    })

   




})


