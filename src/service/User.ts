import { CreateUserDTO, LoginUserDTO } from "../types/User";
import { prisma } from "../prisma/client";
import { User } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import { FastifyInstance } from "fastify";

class UserService {
    public async createUser({name, email, password} : CreateUserDTO): Promise<void> {
        const userExists = await prisma.user.findUnique({
            where: { email: email }
        });

        if(userExists){
            throw new Error("Email já cadastrado.");
        }

        const hashedPassword = await hash(password, 10);

        const newUser : User = {
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await prisma.user.create({
            data: newUser
        });
   }

    public async login({email, password} : LoginUserDTO, app: FastifyInstance): Promise<string | null> {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if(!user){
            throw new Error("Usuário não encontrado.");
        }

        const isPasswordValid = await compare(password, user.password);

        if(!isPasswordValid){
            throw new Error("Senha inválida.");
        }

        return app.jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
   
}


export const userService = new UserService(); 