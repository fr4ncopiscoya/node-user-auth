import crypto from 'crypto';
import bcrypt from 'bcrypt';
import DBLocal from "db-local";

import { SALT_ROUNDS } from './config.js';
const {Schema} = new DBLocal({path: './db'})

const User = Schema('User',{
    _id: {type: String, required: true}, 
    _username: {type: String, required: true},
    _password: {type: String, required: true}
})

export class UserRepository{
    static async create ({username, password}) {
        // Validaciones de username(opcional: usar Zod)
        if(typeof username !== 'string') throw new Error("Username must be a string");
        if(username < 3) throw new Error("Username must be at least 3 characters long");

        if(typeof password != 'string') throw new Error("Password must be a string");
        if(password < 6) throw new Error("Password must be at least 6 characters long");

        // Asegurarse que el username no existe
        const user = User.findOne({_username: username})
        if (user) throw new Error("Username already exist");
        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hashSync(password,SALT_ROUNDS);

        User.create({
            _id: id,
            _username: username,
            _password: hashedPassword
        }).save()

        return id
        
    }
    static login ({username, password}) {}
}