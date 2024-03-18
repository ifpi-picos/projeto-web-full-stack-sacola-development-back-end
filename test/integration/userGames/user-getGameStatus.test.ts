const request = require('supertest');
require('dotenv').config();
const port = process.env.PORT || 5000;
const host = `http://localhost:${port}`;
const mongoose = require('mongoose');
const mongoLocalPassword = process.env.MONGO_LOCAL_PASSWORD

describe('Teste de integração para pegar as listas contendo o status dos jogos de um usuario especifico', () => {
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

        // Cria um usuário para ser usado nos testes
        await request(host)
            .post('/api/v1/user')
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send(user);

        // Adiciona um jogo ao usuário
        await request(host)
            .put(`/api/v1/user/games`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send({
                game: '1'
            });

        // Adiciona um jogo especifico a lista de jogos completos do usuário
        await request(host)
            .put(`/api/v1/user/games/status`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send({
                game: '1',
                status: 'complete'
            })
    });

    it('Deve pegar as listas de status dos jogos do usuario e retornar 200', (done) => {
        request(host)
            .get(`/api/v1/user/games/status`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // Verifique se os dados foram atualizados corretamente
                expect(res.body.gameStatusList.completeGames[0]).toBe('1');
                done();
            });
    });
});