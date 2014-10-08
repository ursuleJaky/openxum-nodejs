Feature: Play with Yinsh game

  Scenario: Player start an AI game
    Given The player is logged
    And An AI game is created
    And The player is black
    When The player click at A1 intersection
    Then A black ring appears at A1