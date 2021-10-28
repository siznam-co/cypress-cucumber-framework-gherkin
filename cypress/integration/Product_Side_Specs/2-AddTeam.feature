Feature: Add new team and users to it.

    This Feature: contains all the test cases of Team CRUD options

    Scenario: Navigates to the team page.
    Given the user is logged in successfully.
        And The user creates Users if do not exist already.
    When the user navigates to the "Teams" screen via "Lists".
    Then the user should be moved to the "Teams".

    Scenario: Add new Team screen is opened.
    When the user hits "addTeamBtn" button.
    Then the user should be moved to the "New Team".

    Scenario: Create a new Team.
    When the user "creates" a "Team".
    Then the "createTeam" operation should be successful for the "Team".
        And the user should be moved to the "Team Details".
        And the "details" appears for the created "Team" should be correct.
