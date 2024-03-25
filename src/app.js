import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import routes from './routes/router.js';
import express from 'express';
import cors from 'cors';
import connectDB from './db/conn.js';
import compression from 'compression';
import middlewareFb from './middlewares/firebase/decodeToken.js';


const app = express();

console.log(process.env.FRONTEND_URL, process.env.FRONTEND_URL_PROD);
app.use(cors([process.env.FRONTEND_URL, process.env.FRONTEND_URL_PROD]));
app.use(helmet());
app.use(compression());
app.use(express.json());

connectDB().then(r => console.log('Conectado com o banco!')).catch(e => console.log(`Erro: ${e}`));

// app.use('/api-docs', swaggerUi.serve);
// app.get('/api-docs', swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center">Api Online!!!</h1> <h2 style="text-align: center">Acesse a documentação' +
        ' em <a href="/api-docs">/Api-docs</a> </h2>');
});

app.get('/api/v1', (req, res) => {
    res.status(200).send('Is working!');
});

app.use(middlewareFb.decodeToken);

app.use('/api/v1', routes);

export default app;