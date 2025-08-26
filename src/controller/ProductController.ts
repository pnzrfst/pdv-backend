import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { productService } from "service/Product";


export default function ProductController(app: FastifyInstance){
    app.addHook("onRequest", app.authenticate);

    app.get("/products", async(request, reply) => {
        const params = request.query;

        try {
            const list = Object.keys(params as object).length > 0
            ? await productService.getByParams(params)
            : await productService.getAllProducts();
         
            return reply.status(200).send(list);
        } catch (error) {
            return reply.code(400).send({error: "Não foi possível listar os produtos."});
        }
    })

    app.post("/products", async(request: FastifyRequest, reply: FastifyReply) =>{
        const body = request.body as CreateProductDTO;

        try {
            const product = await productService.createProduct(body);
            return reply.status(201).send(product);
        } catch (error : any) {
            return reply.code(400).send({error: error.message});
        }
    })

    app.patch("/products", async(request: FastifyRequest, reply: FastifyReply) =>{
        const body = request.body as UpdateProductDTO;

        try {
            const product = await productService.updateProduct(body);
            return reply.status(201).send(product);
        } catch (error : any) {
            return reply.code(400).send({error: error.message});
        }
    })

    app.delete("/products", async(request: FastifyRequest, reply: FastifyReply) =>{
        const body = request.body as {id : string};

        try {
            const product = await productService.deleteProduct(body.id);
            return reply.status(201).send(product);
        } catch (error : any) {
            return reply.code(400).send({error: error.message});
        }
    })

    // app.get("/products", async(request: FastifyRequest, reply: FastifyReply) =>{
    //     const params = request.query

    //     try {
    //         const list = await productService.getByParams(params);
    //         return reply.status(200).send(list);
    //     } catch (error: any) {
    //         return reply.code(400).send({error: "Não foi possível listar os produtos."});
    //     }
    // })
}