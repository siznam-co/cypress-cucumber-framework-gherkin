Feature: Add new template.

    This Feature: contains all the test cases of Team CRUD options

    Scenario: Navigate to the Templates screen.
    Given the user is logged in successfully.
        And The user creates Teams if do not exist already.
    When the user navigates to the "Templates" screen.
    Then the user should be moved to the "Templates".

    Scenario: Validate add step without adding mandatory fields.
    When the user hits "addTemplateBtn" button..
        And the user should be moved to the "New Template".
        And the user adds "newStep" at the "Template" screen.
    Then the user hits "saveStep" without submitting mandatory fields at the "Template" screen..

    Scenario: Validate add step with adding mandatory fields.
    When the user adds "stepData" at the "Template" screen.
        And the user adds "activities" at the "Template" screen.
    Then the user hits "saveStep" with submitting all mandatory fields at the "Template" screen..
        # Todo: Add validations of added step data 
        # add multiple steps
        # add multiple different activities.

    Scenario: Validate Create template without adding mandatory fields.
    When the user hits "saveAndPublish" without submitting mandatory fields at the "Template" screen..

    Scenario: Validate Create template with adding mandatory fields.
    When the user "creates" the "Template".
        And the user hits "saveAndPublish" with submitting all mandatory fields at the "Template" screen..
    Then the "createTemplate" operation should be successful for the "Team".
        # And the user should be moved to the "Template Details".
        # And the "details" of the created "Template" should be correct.
