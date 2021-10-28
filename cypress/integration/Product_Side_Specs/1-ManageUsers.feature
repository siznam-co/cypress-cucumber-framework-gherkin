Feature: Add a new user.

    This Feature: contains all the test cases of user CRUD options

    Scenario: Navigates to the Manage Users page.
    Given the user is logged in successfully.
    When the user navigates to the "Manage Users" screen via "Administrator".
    Then the user should be moved to the "Manage Users".

    
    Scenario: Add new User screen is opened.
    When the user hits "addUserBtn" button.
    Then the user should be moved to the "New User".

    Scenario: Create a user and verify it's details.
    When the user "creates" a "User".
    Then the "createUser" operation should be successful for the "User".
        And the user should be moved to the "User Details".
        And the "details" appears for the created "User" should be correct.
