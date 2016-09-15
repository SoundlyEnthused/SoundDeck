require(TEST_HELPER); // <--- This must be at the top of every test file.

const request = require('supertest-as-promised');
const routes = require(__server + '/index.js');

describe('The Server', () => {
  const app = TestHelper.createApp();
  app.use('/', routes);
  app.testReady();

  it_('serves an example endpoint', function* () {
    //
    // Notice how we're in a generator function (indicated by the the *)
    // See test/test-helper.js for details of why this works.
    //
    yield request(app)
      .get('/api/tags-example')
      .expect(200)
      .expect((response) => {
        expect(response.body).to.include('node');
      });
  });
});
