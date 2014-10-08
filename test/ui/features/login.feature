Feature: Player can login to web application
  As a player

  Scenario: Player sign in
    Given No user log
    When Player sign in
    Then The player is logged