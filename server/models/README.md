# SoundDeck
---
[<img src="https://travis-ci.org/SoundlyEnthused/SoundDeck.svg?branch=master"/>](https://travis-ci.org//SoundlyEnthused/SoundDeck.svg?branch=master)
[![coverage-12%](http://img.shields.io/badge/coverage-12%-brightgreen.svg?style=flat)]()


SoundDeck is a place where SoundCloud users can go to share music with other SoundCloud users in a turn-based DJ environment. Users collect a 'like' count and can vote to skip tracks.

https://sounddeck.herokuapp.com/

### Tech Stack

- React
- NodeJS
- Express
- MongoDB
- Socket.io
- Mocha/Chai/Enzyme for testing

### Getting Started
```
$ npm install
$ npm start
```
Now visit [localhost:4000](http://localhost:4000/)

### API

See the [**SoundCloud API guide**](https://developers.soundcloud.com/docs/api/guide) here.

### Testing

- Run test suite
> npm test

- Run code coverage (make sure you have babel-cli installed globally)
> npm run cover

### Team

[Robert Ferguson](https://github.com/rewfergu) |
[Chris Kiel](https://github.com/no-fi) |
[CC Yang](https://github.com/siliconion) |
[Joe Stowers](https://github.com/jstowers) |
[Aaron Ventura](https://github.com/Macabre1)

### Git Flow

For a new feature, do:
> git checkout -b <featureName>

Then work on the feature on the local branch.

To make a pull request:
> git checkout master
> git pull
> git checkout <featureName>
> git rebase master

Resolve all conflicts, then
> git push -u origin <featureName>

Then submit the pull request to master.
