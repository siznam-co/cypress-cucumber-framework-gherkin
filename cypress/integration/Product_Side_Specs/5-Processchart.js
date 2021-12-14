/// <reference types="Cypress" />
require('@4tw/cypress-drag-drop')

const { multiply, trimEnd } = require("lodash")
const ChecklistLocators = require("../../Locators/ChecklistLocators.json")
const commonLocators = require("../../Locators/commonLocators.json")

describe("Create and run new Checklist.", () => {
    before(() => {

        cy.loginWithApi(Cypress.env("Username"), Cypress.env("Password"))
        // Add more to before all operation.
        cy.get(commonLocators.menuBtn).contains("Process Chart").click({ force: true })
        cy.get(commonLocators.pageHeading).should("contain", "Process Chart")
        // create Teams Using Api if not already exists.
        // cy.createTeamsUsingApi()
    })

    beforeEach(() => {
        // Add to each "it" 
    })

    it("Create a Process chart", () => {
         cy.intercept('GET', '/api/processOverview?showDraft=true')
        cy.wait("@waitForCharts").its("response.statusCode").should("eq", 200)
        cy.get("div.input-field--preview.bold").contains("Ab process").parents("div.react-flow__node-Process").click()

        //cy.get("div.react-flow__renderer.react-flow__zoompane").should('be.visible')
        cy.get('div.react-flow__node.react-flow__node-Input').should('be.visible', { multiple: true })
        cy.get("div.btn-group > button.btn__blue.btn-transparent").click()
        cy.get('div.react-flow__node.react-flow__node-Input').should('be.visible', { multiple: true })


        cy.get('div.rf-add-elements--elements > div >div').drag('div > div.react-flow__pane', {
            source: { deltax: 80, deltay: 80 }, // applies to the element being dragged
            target: { position: 'center' }, // applies to the drop target
            force: true, // applied to both the source and target element
        })

        //for other click
        cy.get('div.rf-add-elements--elements > div >div').drag('div > div.react-flow__pane', {
            source: { x: -80, y: -80 }, // applies to the element being dragged
            target: { position: 'left' }, // applies to the drop target
            force: true, // applied to both the source and target element
        })
      
          cy.get('div.react-flow__node-SubProcess div.react-flow__handle-left')
             .eq(8).drag('div.react-flow__node-SubProcess div.react-flow__handle-right').eq(8)
            //   .move('div.react-flow__node-SubProcess:nth-child(12) div.react-flow__handle-right')
    
        
    })
   

})