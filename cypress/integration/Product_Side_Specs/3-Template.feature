Feature: Add new template.

    This Feature: contains all the test cases of Team CRUD options

    Scenario: Create a template.
    Given The user is logged in successfully.
    When the user navigates to the "Templates" screen.
    Then The user should be moved to the "Templates".
    When the user "creates" a "Template".
    Then the "Template" should be created successfully.
    # Then The user should be moved to the "Template Details".
        # And the "details" of the created "Template" should be correct.
