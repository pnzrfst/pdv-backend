import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserDTO, LoginUserDTO } from '../types/User';
import { userService } from '../service/User';

export default function UserController(app: FastifyInstance) {
    app.post("/users", async( request: FastifyRequest, reply: FastifyReply) => {
        const body = request.body as CreateUserDTO

        try {
            await userService.createUser(body);
            return reply.status(201).send();
        } catch (error: any) {
            return reply.status(400).send({error: error.message});
        }
    })

    app.post("/users/login", async( request: FastifyRequest, reply: FastifyReply) => {
        const body = request.body as LoginUserDTO

        try {
            const token = await userService.login(body, app);
            return reply.status(201).send({accesToken: token});
        } catch (error: any) {
            return reply.status(400).send({error: error.message});
        }
    })
    
    app.patch("/users/reset-password", async(request: FastifyRequest, reply: FastifyReply) => {
        const {email, password} = request.body as {email: string, password: string};
        try{
            await userService.resetPassword(email, password);
            return reply.status(204).send();
        }catch(error: any){
            return reply.status(400).send({error: error.message});
        }

    })// Controller logic here
}