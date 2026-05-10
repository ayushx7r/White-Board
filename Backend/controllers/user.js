import User from "../model/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const handleRegister = async (req, res) => {
    try {
        const {name, username, email, password} = req.body;
        const user = await User.register(name, username, password, email);
        return res.status(200).json({'message' : 'User registered sucessfully'});
    } catch(err) {
        res.status(400).json({message : err.message});
    }
}

export const handleLogin = async (req, res) => {

    try {
        const {email, password} = req.body;
        const user = await User.login(email, password);
        const token = jwt.sign({id : user.id, name : user.name, email : user.email, username : user.username}, "KEY", {expiresIn : '1h'});
        res.cookie('token', token, {
            httpOnly : true,
            sameSite: 'none',
            secure : true,
            maxAge : 1000 * 60 * 60
        });
        return res.status(202).json({token});
    } catch(err) {
        res.status(401).json({message : err.message});
    }
    
}