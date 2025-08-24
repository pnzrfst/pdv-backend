import fastify from 'fastify'
import cors from '@fastify/cors';
import UserController from './controller/UserController';
import authJwt from './middleware/authJwt';

const app = fastify();

app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE"]
}); 

const port = 3333;

app.register(UserController);
app.register(authJwt);


app.listen({port: port}).then(() => {
    console.log(`Servidor rodando na porta ${port}`)
})