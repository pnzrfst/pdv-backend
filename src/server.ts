import fastify from 'fastify'
import cors from '@fastify/cors';
import UserController from './controller/UserController';
import authJwt from './middleware/authJwt';
import ProductController from 'controller/ProductController';
import CategoryController from 'controller/CategoryController';
import SalesController from 'controller/SalesController';
import ClientsController from 'controller/ClientsController';

const app = fastify();

app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE"]
}); 

const port = 3333;

app.register(authJwt);
app.register(UserController);
app.register(ProductController);
app.register(CategoryController);
app.register(SalesController);
app.register(ClientsController);

app.listen({port: port}).then(() => {
    console.log(`Servidor rodando na porta ${port}`)
})