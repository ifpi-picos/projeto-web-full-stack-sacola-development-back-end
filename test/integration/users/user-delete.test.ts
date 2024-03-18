const request = require('supertest');
require('dotenv').config();
const port = process.env.PORT || 5000;
const host = `http://localhost:${port}`;
const mongoose = require('mongoose');
const mongoLocalPassword = process.env.MONGO_LOCAL_PASSWORD

describe('Teste de integração para deletar um usuário específico', () => {
    let userId;

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

        userId = response.body._id;
    });

    it('Deve deletar um usuário específico com status 204', (done) => {
        request(host)
            .delete(`/api/v1/user`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .expect(204) // 204 indica que o usuário foi deletado com sucesso
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});