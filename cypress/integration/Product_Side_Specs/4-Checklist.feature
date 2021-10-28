Feature: Create and run new Checklist.

    This Feature: contains all the test cases of Checklist CRUD options

    Scenario: Create a Checklist.
    Given the user is logged in successfully.
        And The user creates Template if it doesn't exist already.
    When the user "creates" a "Checklist".
    Then the "createChecklist" operation should be successful for the "Team".

    Scenario: Run a Checklist without submitting mandatory fields.
    When the user hits "finalize" without submitting mandatory fields at the "Checklist" screen.

    Scenario: Run a Checklist without submitting mandatory fields.
    When the user "runs" a "Checklist".
        And the user hits "finalize" with submitting all mandatory fields at the "Checklist" screen.
        # And the user "deletes" a "Checklist".
