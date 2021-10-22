Feature: Create and run new Checklist.

    This Feature: contains all the test cases of Checklist CRUD options

    Scenario: Create a Checklist.
    Given The user is logged in successfully.
    When the user "creates" a "Checklist".
    Then the "Checklist" should be created successfully.

    Scenario: Run a Checklist without submitting mandatory fields.
    When the user hits "finalize" without submitting mandatory fields at the "Checklist" step.

    Scenario: Run a Checklist without submitting mandatory fields.
    When the user "runs" a "Checklist".
        And the user hits "finalize" with submitting all mandatory fields at the "Checklist" step.
