NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-core/register -r jsdom-global/register --recursive ./test/client "$@"
