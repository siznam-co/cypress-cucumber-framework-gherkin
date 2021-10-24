Feature: Add new team and users to it.

    This Feature: contains all the test cases of Team CRUD options

    Scenario: Navigates to the team page.
    Given The user is logged in successfully.
    When the user navigates to the "Teams" screen via "Lists".
    Then The user should be moved to the "Teams".

    Scenario: Add new Team screen is opened.
    When the user hits "addTeamBtn" button.
    Then The user should be moved to the "New Team".

    Scenario: Create a new Team.
    When the user "creates" a "Team".
    Then the "Team" should be created successfully.
        And The user should be moved to the "Team Details".
        And the "details" of the created "Team" should be correct.
