NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-core/register -r jsdom-global/register -r dotenv/config --recursive ./test/client "$@"
