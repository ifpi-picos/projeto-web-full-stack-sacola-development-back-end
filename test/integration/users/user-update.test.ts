const request = require('supertest');
require('dotenv').config();
const port = process.env.PORT || 5000;
const host = `http://localhost:${port}`;
const mongoose = require('mongoose');
const mongoLocalPassword = process.env.MONGO_LOCAL_PASSWORD

describe('Teste de integração para atualizar um usuário específico', () => {
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

        await request(host)
            .post('/api/v1/user')
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send(user);
    });

    it('Deve atualizar um usuário específico com status 200', (done) => {
        request(host)
            .put(`/api/v1/user`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send({
                name: 'NovoNome',
                username: 'novo-username',
                email: 'novo-email@gmail.com',
            })
            .expect(200) // 200 indica que o usuário foi atualizado com sucesso
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // Verifique se os dados foram atualizados corretamente
                expect(res.body.user.name).toBe('NovoNome');
                expect(res.body.user.username).toBe('novo-username');
                expect(res.body.user.email).toBe('novo-email@gmail.com');
                done();
            });
    });
});


describe('Teste para verificar se o erro 400 badrequest esta funcionando', () => {
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

    it('Deve retornar status 400 bad request', (done) => {
        request(host)
            .put(`/api/v1/user`)
            .set('Authorization', 'Bearer ' + 'r3KqG4388aUeceKldqC3OQJt5wA3')
            .set('Client_Token', process.env.CLIENT_TOKEN)
            .send()
            .expect(400) // 400 indica que houve um erro na requisição por falta de dados
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});