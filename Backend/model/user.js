import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    name : {
        type : String,
        required : true,
        
    },
    username : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String, 
        required : true,
        unique : true
    }, 
    friends : [{
        type : Schema.ObjectId,
        ref : "User"
    }]
})

userSchema.statics.register = async function(name, username, password, email) {
    try {
        if(!name || !username || !password || !email) {
            throw Error("input");
        }
        let searchUser = await this.findOne({username});
        if(searchUser) throw Error("user");
        let searchEmail = await this.findOne({email});
        if(searchEmail) throw Error("email");
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.create({
            name, username, password : hashedPassword, email
        });
        return user;
    } catch(err) {
        throw Error(err.message);
    }
    
}

userSchema.statics.login = async function(email, password) {
    try {
        const user = await this.findOne({email});
        if(!user) throw Error("user");
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword) throw Error("password");

        return user;
    } catch (err) {
        throw Error(err.message);
    }
}

const User = model("User", userSchema);

export default User;