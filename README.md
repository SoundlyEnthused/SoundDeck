# SoundDeck

TBD

- [Description](#description)
    - [Tech Stack](#tech-stack)
    - [Authors](#authors)
- [Usage](#usage)
    - [Getting Started](#getting-started)
    - [Testing](#testing)
    - [Git Flow](#git-flow)

## Description

TBD 

### Tech Stack
- React
- Node/Express
- Socket.io
- Mocha/Chai for testing

### Authors
- [Aaron](https://github.com/)
- [CC](https://github.com/)
- [Chris](https://github.com/)
- [Joe](https://github.com/)
- [Robert](https://github.com/)

## Usage

### Getting Started
```
$ npm install
$ npm start
```

Now visit [localhost:4000](http://localhost:4000/)

### Testing

- Run test suite
> npm test

- Run code coverage (make sure you have babel-cli installed globally)
> npm run cover

### Git Flow

For a new feature, do:
> git checkout -b <featureName>

then work on the feature on the local branch.

To make a pull request:
> git checkout master
> git pull
> git checkout <featureName>
> git rebase master

Resolve all conflicts, then
> git push -u origin <featureName>

Then submit the pull request to master.