Feature: Add new team and users to it.

    This Feature: contains all the test cases of Team CRUD options

    Scenario: Create a team.
    Given The user is logged in successfully.
    When the user navigates to the "Teams" screen via "Lists".
    Then The user should be moved to the "Teams".
    When the user "creates" a "Team".
    Then the "Team" should be created successfully.
    Then The user should be moved to the "Team Details".
        And the "details" of the created "Team" should be correct.
