const request = require('supertest');
require('dotenv').config();

const port = process.env.PORT || 5000;
const host = `http://localhost:${port}`;

describe('Testar a validação do usuario', () => {
    it('Deve retornar status 200 e o token pra salvar no front', (done) => {
        request(host)
            .get('/api/v1/user/auth')
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body).toHaveProperty('token');
                done();
            });
    });
});