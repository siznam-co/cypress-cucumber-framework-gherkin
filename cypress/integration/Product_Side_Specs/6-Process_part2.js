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
                cy.wrap(parentElement).find(ProcessChartLocators.creates2.subProcessDropdown["dropdown"]).click()
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
    cy.get('div.react-flow__nodes div.rf-node div.rf-node--content label.text-field div.text-field--box textarea').eq(0).clear().type('sdflkjskdfljsdaklfjlsdakfjlksadf')
    cy.get('div.react-flow__nodes div.rf-node div.rf-node--content label.text-field div.text-field--box textarea').eq(1).clear().type('sdflkjskdfljsdaklfjlsdakfjlksadf')
       
    cy.get('div.react-flow__nodes div.rf-node div.rf-node--content label.text-field div.text-field--box textarea').eq(2).clear().type('sdflkjskdfljsdaklfjlsdakfjlksadf')
    cy.get('div.react-flow__nodes div.rf-node div.rf-node--content label.text-field div.text-field--box textarea').eq(3).clear().type('sdflkjskdfljsdaklfjlsdakfjlksadf')
  
    cy.get('div.react-flow__nodes div.rf-node div.rf-node--content label.text-field div.text-field--box textarea').eq(4).clear().type('sdflkjskdfljsdaklfjlsdakfjlksadf')
    cy.get('div.react-flow__nodes div.rf-node div.rf-node--content label.text-field div.text-field--box textarea').eq(5).clear().type('sdflkjskdfljsdaklfjlsdakfjlksadf')
    cy.get('div.react-flow__nodes div.rf-node div.rf-node--content label.text-field div.text-field--box textarea').eq(6).clear().type('sdflkjskdfljsdaklfjlsdakfjlksadf')
    cy.get('div.react-flow__nodes div.rf-node div.rf-node--content label.text-field div.text-field--box textarea').eq(7).clear().type('sdflkjskdfljsdaklfjlsdakfjlksadf')

   

    cy.get('div.rf-add-elements--elements > div >div').drag('div > div.react-flow__pane', {
        source: { deltax: 0, deltay: 0 }, // applies to the element being dragged
        target: { position: 'center' }, // applies to the drop target
        force: true, // applied to both the source and target element
    })

    //for other click
    cy.get('div.rf-add-elements--elements > div >div').drag('div > div.react-flow__pane', {
        source: { x: -10, y: -10 }, // applies to the element being dragged
        target: { position: 'left' }, // applies to the drop target
        force: true, // applied to both the source and target element
    })

    cy.get(ProcessChartLocators.Publish).dblclick({ force: true })
        
        
        
    })

})


