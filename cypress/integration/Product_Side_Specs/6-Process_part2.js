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
        //cy.get('button.uf-close-button').click()
        cy.get(ProcessChartLocators.EditBtn).click()
        cy.fixture("ProcessChart_data").then(data => {

            cy.get(ProcessChartLocators.NewSupport1).eq(0).clear().type(data.CreatesAll.NewSupport1)
            cy.get(ProcessChartLocators.NewSupport2).clear().type(data.CreatesAll.NewSupport2)
            cy.get(ProcessChartLocators.NewSupport3).clear().type(data.CreatesAll.NewSupport3)
            cy.get(ProcessChartLocators.NewSupport4).clear().type(data.CreatesAll.NewSupport4)
            cy.get(ProcessChartLocators.NewSupport5).clear().type(data.CreatesAll.NewSupport5)
            cy.get(ProcessChartLocators.NewSupport6).clear().type(data.CreatesAll.NewSupport6)
        })


        cy.get(ProcessChartLocators.ScopeOfManagementSystem).click()

        cy.fixture("ProcessChart_data").then(data => {

            cy.get(ProcessChartLocators.What).clear().type(data.CreatesAll1.What)
            cy.get(ProcessChartLocators.Why).clear().type(data.CreatesAll1.Why)
            cy.get(ProcessChartLocators.Overview).clear().type(data.CreatesAll1.Overview)

        })
        cy.fixture("ProcessChart_data").then(data => {
            cy.selectFromDropdown(ProcessChartLocators.creates1.subProcessDropdown, data.creates1.addUsersMultipleSelect, "MultipleSelect")

        })
        //click on the responsible user
        cy.get(ProcessChartLocators.Publish).click({ force: true })

        cy.get(ProcessChartLocators.Bold).contains("Ab process").parents(ProcessChartLocators.Parent).click({ force: true })


    })
    it("Create a Process chart", () => {
        cy.intercept('GET', '/api/processOverview?showDraft=true')

        cy.get(ProcessChartLocators.Bold).contains("Ab process").parents(ProcessChartLocators.Parent).click()

        cy.get('div.react-flow__node.react-flow__node-Input').should('be.visible', { multiple: true })
        cy.get("div.btn-group > button.btn__blue.btn-transparent").click()
        cy.get('div.react-flow__node.react-flow__node-Input').should('be.visible', { multiple: true })

        //For to create a risks with fixture

        cy.fixture("ProcessChart_data").then(data => {

            //  cy.get(ProcessChartLocators.IdentityRisk).eq(0).clear().type(data.IdentityRisks.IdentityRisks1)
            //  cy.get(ProcessChartLocators.IdentityRiskBtn).eq(0).click()
            //  cy.get(ProcessChartLocators.IdentityRisk).eq(1).clear().type(data.IdentityRisks.IdentityRisks2)
            // cy.get(ProcessChartLocators.IdentityRiskBtn).eq(0).click()
            //  cy.get(ProcessChartLocators.IdentityRisk).eq(2).clear().type(data.IdentityRisks.IdentityRisks3)

            cy.get(ProcessChartLocators.IdentityTarget).eq(0).clear().type(data.IdentityRisks.IdentityTarget1)
            cy.get(ProcessChartLocators.IdentityRiskBtn).eq(0).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(1).clear().type(data.IdentityRisks.IdentityTarget2)
            cy.get(ProcessChartLocators.IdentityRiskBtn).eq(0).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(2).clear().type(data.IdentityRisks.IdentityTarget3)
            cy.get(ProcessChartLocators.InputBtn).eq(1).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(3).clear().type(data.IdentityRisks.Input1)
            cy.get(ProcessChartLocators.InputBtn).eq(1).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(4).clear().type(data.IdentityRisks.Input2)
            // cy.wait("@WaitForpopup").its("response.statusCode").should("eq", 200)
            // cy.get('button.uf-close-button').click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(5).clear().type(data.IdentityRisks.Output1)
            cy.get(ProcessChartLocators.InputBtn).eq(3).click()
            cy.get(ProcessChartLocators.IdentityTarget).eq(6).clear().type(data.IdentityRisks.Output2)
            cy.get(ProcessChartLocators.InputBtn).eq(4).click()
        })


        cy.fixture("ProcessChart_data").then(data => {

            // cy.selectFromDropdown(ProcessChartLocators.creates.subProcessDropdown, data.creates.subProcessDropdown, "SingleSelect")

            cy.get(ProcessChartLocators.Output_to).contains("Output to").parent().then(parentElement => {
                cy.wrap(parentElement).find('div.justify-right button').click()
                cy.wrap(parentElement).find(ProcessChartLocators.creates2.subProcessDropdown["dropdown"]).click({ force: true })
                cy.wrap(parentElement).find(ProcessChartLocators.creates2.subProcessDropdown["input"]).type(data.creates.subProcessDropdown, { force: true })
                cy.wrap(parentElement).find(ProcessChartLocators.creates2.subProcessDropdown["options"]).contains(data.creates.subProcessDropdown).click()

                cy.get('textarea#purpose').clear().type('Identifiy Target 2')

            })

        })

        cy.fixture("ProcessChart_data").then(data => {
            cy.selectFromDropdown(ProcessChartLocators.ResponsibleUser.RespUser, data.ResponsibleUser.addUsersMultipleSelect, "MultipleSelect")

            cy.selectFromDropdown(ProcessChartLocators.InvolvedTeams.Teams, data.InvolvedTeams.addUsersMultipleSelectTeam, "MultipleSelect")
            // cy.wait("@WaitForpopup").its("response.statusCode").should("eq", 400)

        })
        cy.fixture("ProcessChart_data").then(data => {


            cy.get(ProcessChartLocators.Subprocess).eq(0).clear().type(data.Subprocess.Subprocess1)
            cy.get(ProcessChartLocators.Subprocess).eq(1).clear().type(data.Subprocess.Subprocess2)

            cy.get(ProcessChartLocators.Subprocess).eq(3).clear().type(data.Subprocess.Subprocess3)

            cy.get(ProcessChartLocators.Subprocess).eq(4).clear().type(data.Subprocess.Subprocess4)
            cy.get(ProcessChartLocators.Subprocess).eq(5).clear().type(data.Subprocess.Subprocess5)
            cy.get(ProcessChartLocators.Subprocess).eq(6).clear().type(data.Subprocess.Subprocess6)
            cy.get(ProcessChartLocators.Subprocess).eq(7).clear().type(data.Subprocess.Subprocess7)
            cy.get(ProcessChartLocators.Subprocess).eq(2).clear().type(data.Subprocess.Subprocess8)
            cy.get('div.rf-add-elements--elements > div >div').drag('div > div.react-flow__pane', {
                source: { deltax: 20, deltay: 20 }, // applies to the element being dragged
                target: { position: 'right' }, // applies to the drop target
                force: true, // applied to both the source and target element
            })

            //for other click
            cy.get('div.rf-add-elements--elements > div >div').drag('div > div.react-flow__pane', {
                source: { x: 0, y: 0 }, // applies to the element being dragged
                target: { position: 'left' }, // applies to the drop target
                force: true, // applied to both the source and target element
            })
            cy.get(ProcessChartLocators.Subprocess9).eq(8).clear().type(data.Subprocess.Subprocess9)
        })


        cy.get('div.menu-button__wrapper.rf-node--users--add').eq(1).click()
        cy.get('ul.menu-button--menu-list li.with-checkbox').eq(0).click()

        cy.get('div.menu-button__wrapper.rf-node--users--add').eq(1).click()
        //  cy.get('ul.menu-button--menu-list li.with-checkbox').eq(3).click()
        cy.get('div > div.react-flow__pane').click({ force: true })
        //    cy.fixture("ProcessChart_data").then(data => {
        //    cy.selectFromDropdown(ProcessChartLocators.AddUser.User, data.AddUser.User, "SingleSelect")

        // })
        cy.get(ProcessChartLocators.Publish).dblclick({ force: true })



    })

})


