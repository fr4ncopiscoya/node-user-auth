import express from 'express'
import {PORT} from './config.js'
import { UserRepository } from './user-repository.js'
const app = express()
app.use(express.json())

app.get('/',(req, res)=>{
    res.send('Hello Franco xd')
})

app.post('/login',(req, res)=>{})
app.post('/register', async (req, res)=>{
    const { username , password }= req.body //???
    console.log("req.body: ", req.body);
    
    try {
        const id = await UserRepository.create({username,password})
        res.send({id})
    } catch (error) {
        console.log("error:", error);
        res.status(400).send(error.message)
    }

})
app.post('/logout',(req, res)=>{})
app.post('/protected',(req, res)=>{})

app.listen(PORT,()=>{
    console.log(`Serve running on port ${PORT}`);
})