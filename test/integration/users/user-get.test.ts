const request = require('supertest');
require('dotenv').config();
const port = process.env.PORT || 5000;
const host = `http://localhost:${port}`;
const mongoose = require('mongoose');
const mongoLocalPassword = process.env.MONGO_LOCAL_PASSWORD

describe('Teste de integração para obter um usuário específico', () => {
    beforeAll(async () => {
        await mongoose.connect(`mongodb://conde:${mongoLocalPassword}@localhost:27017/appTest?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await mongoose.connection.collection('users').deleteMany({});

        const user = {
            _id: 'r3KqG4388aUeceKldqC3OQJt5wA3',
            name: 'Teste',
            username: 'teste',
            email: 'teste@gmail.com',
        };

        const response = await request(host)
            .post('/api/v1/user')
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send(user);
    });

    it('Deve retornar um usuário específico com status 200', (done) => {
        request(host)
            .get(`/api/v1/user`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                expect(res.body.user._id).toBe('r3KqG4388aUeceKldqC3OQJt5wA3');
                expect(res.body.user.name).toBe('Teste');
                expect(res.body.user.username).toBe('teste');
                expect(res.body.user.email).toBe('teste@gmail.com');
                done();
            });
    });
});