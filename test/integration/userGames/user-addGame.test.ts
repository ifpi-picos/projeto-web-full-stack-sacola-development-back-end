const request = require('supertest');
require('dotenv').config();
const port = process.env.PORT || 5000;
const host = `http://localhost:${port}`;
const mongoose = require('mongoose');
const mongoLocalPassword = process.env.MONGO_LOCAL_PASSWORD

describe('Teste de integração para adicionar um jogo a um usuario especifico', () => {
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

    it('Deve adicionar um jogo a um usuario especifico com status 200', (done) => {
        request(host)
            .put(`/api/v1/user/games`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send({
                game: '1'
            })
            .expect(200) // 200 indica que o usuário foi atualizado com sucesso
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // Verifique se os dados foram atualizados corretamente
                expect(res.body.user.userGames.games[0].LocalGameData.game_List[0]).toBe('1');
                done();
            });
    });
});

describe('Teste de integração para adicionar um jogo a um usuario especifico', () => {
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

    it('Deve dar erro 400 bad request caso falte dados', (done) => {
        request(host)
            .put(`/api/v1/user/games`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send()
            .expect(400) // 400 indica bad request
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // Verifique se os dados foram atualizados corretamente
                done();
            });
    });
});

