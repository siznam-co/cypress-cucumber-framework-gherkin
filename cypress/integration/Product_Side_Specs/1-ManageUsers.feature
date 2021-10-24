Feature: Add a new user.

    This Feature: contains all the test cases of user CRUD options

    Scenario: Navigates to the Manage Users page.
    Given The user is logged in successfully.
    When the user navigates to the "Manage Users" screen via "Administrator".
    Then The user should be moved to the "Manage Users".

    
    Scenario: Add new User screen is opened.
    When the user hits "addUserBtn" button.
    Then The user should be moved to the "New User".

    Scenario: Create a user and verify it's details.
    When the user "creates" a "User".
    Then the "User" should be created successfully.
        And The user should be moved to the "User Details".
        And the "details" of the created "User" should be correct.
        And the new email for the future "User" should be stored.
