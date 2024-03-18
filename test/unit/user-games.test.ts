const request = require('supertest');
require('dotenv').config();

const port = process.env.PORT || 5000;
const host = `http://localhost:${port}`;

describe('All users', () => {
    it('should return status 200', (done) => {
        request(host)
            .get('/api/v1')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});
