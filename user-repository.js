import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import DBLocal from "db-local";

import { SALT_ROUNDS } from './config.js';
const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
    _id: { type: String, required: true },
    _username: { type: String, required: true },
    _password: { type: String, required: true }
})

export class UserRepository {
    static async create({ username, password }) {
        // Validaciones de username(opcional: usar Zod)
        Validation.username(username);
        Validation.password(password);

        // Asegurarse que el username no existe
        const user = User.findOne({ _username: username })
        if (user) throw new Error("Username already exist");
        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        User.create({
            _id: id,
            _username: username,
            _password: hashedPassword
        }).save()

        return id
    };

    static async login({ username, password }) {        
        Validation.username(username);
        Validation.password(password);

        const user = User.findOne({_username: username})
        if(!user) throw new Error("username doesnt exist");

        console.log("Stored hashed password:", user._password)

        const isValid = await bcrypt.compare(password, user._password)
        if(!isValid) throw new Error("password is invalid")

        // -- Solo los que no quieres devolver --
        // const { _password: _, ... publicUser } = user
        // return publicUser

        return {
            id: user._id,
            username: user._username,
        } // BEST WAY (Los que quieres devolver)
    };

}

// VALIDATION USERNAME && PASSWORD
class Validation {
    static username(username){
        if (typeof username !== 'string') throw new Error("Username must be a string");
        if (username.length < 3) throw new Error("Username must be at least 3 characters long");
    }

    static password(password){
        if (typeof password != 'string') throw new Error("Password must be a string");
        if (password.length < 6) throw new Error("Password must be at least 6 characters long");
    }
}