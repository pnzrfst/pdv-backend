import fastifyPlugin from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "fastify-jwt";

export default fastifyPlugin(async (fastify) => {
  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
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
