# The Clue Guru

This repository holds the source code for a web application designed to help with the board game Clue. It tracks all the information given to a player and helps intelligently make inferences that can be difficult to track on paper.

## Technologies Used

* [Angular2 for TypeScript - JavaScript framework](https://angular.io/docs/ts/latest/)
* [npm - package manager](https://www.npmjs.com/)
* [Karma - test runner](https://karma-runner.github.io/1.0/index.html)
* [Jasmine - testing framework](https://jasmine.github.io/)
* [ng2-bootstrap - Twitter Bootstrap components](http://valor-software.com/ng2-bootstrap/#/)

## Run the Application

Clone this repo into new project folder (e.g., `clue`).
```bash
git clone  https://github.com/estrandvold/clue-helper.git  clue
cd clue
```

Ensure npm is installed. If not, [install it.](https://docs.npmjs.com/getting-started/installing-node)

Install the application.
```bash
npm install
```

Run the application.
```bash
npm start
```

## Test the Application

```bash
npm test
```

## User Stories
User stories and issues are tracked [here.](https://tree.taiga.io/project/estrandvold-clue-guru/)

## What Does the Clue Guru Do?
Currently this application allows users to keep a digital scorecard for the board game Clue. This scorecard not only tracks the player's information, but also the information for all the opponents. By recording guesses and responses the application can track extra information based on the following rules:
* If an opponent has a specific item, then no other opponents have that item.
* If an opponent doesn't show a card, that means they don't have any of the three items in the guess.
* If an opponent shows a card to another opponent, we know they have at least one of the items in the guess. In the application this is called an "OR". These ORs are studied each time new information about an opponent is received. For example, suppose I learn that Bob has either Miss Scarlet, the Rope, or the Kitchen. These three items are stored in an OR. Later in the game, I learn that Bob doesn't have Miss Scarlet and the Kitchen. The OR now tells me that Bob definitely has the Rope. Of course this means that no one else has the Rope; this could potentially allow inferences from other opponent's ORs.
