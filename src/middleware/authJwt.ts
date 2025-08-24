import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async (fastify) => {
    fastify.register(require('fastify-jwt'), {
        secret: process.env.JWT_SECRET
    })

    fastify.decorate("authenticate", async(request, reply) =>{
        try{
            await request.jwtVerify();
        }catch(err){
            return reply.status(401).send({err: "Não autorizado!"});
        }
    })
})