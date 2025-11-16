import fastifyPlugin from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "fastify-jwt";

export default fastifyPlugin(async (fastify) => {
  const jwtSecret = process.env.JWT_SECRET;
  const cookieSecret = process.env.COOKIE_SECRET;

   if(!jwtSecret) throw new Error("JWT_SECRET is not defined");
  if(!cookieSecret) throw new Error("COOKIE_SECRET is not defined");

  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    expires: 3600,
  });

 
  fastify.register(fastifyJwt, {
    secret: jwtSecret,
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.clearCookie("token");
      reply.status(401).send({ err: "Não autorizado!" });
    }
  });

  fastify.get(
    "/auth/validate-token",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      return { valid: true };
    }
  );
});
