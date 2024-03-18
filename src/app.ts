require('dotenv').config();
const helmet = require('helmet');
const routes = require('./routes/router');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/conn');
const compression = require('compression');
const middlewareFb = require('./middlewares/firebase/decodeToken.js');
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require('./swagger.json')

const app = express();

app.use(cors([process.env.FRONTEND_URL, process.env.FRONTEND_URL_PROD]));
app.use(helmet());
app.use(compression());
app.use(express.json());

connectDB().then(r => console.log('Conectado com o banco!')).catch(e => console.log(`Erro: ${e}`));

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center">Api Online!!!</h1> <h2 style="text-align: center">Acesse a documentação' +
        ' em <a href="/api-docs">/Api-docs</a> </h2>');
});

app.get('/api/v1', (req, res) => {
    res.status(200).send('Is working!');
});

app.use(middlewareFb.decodeToken);

app.use('/api/v1', routes);

module.exports = app;