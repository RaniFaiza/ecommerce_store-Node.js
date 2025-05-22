//import JWT
const jwt = require('jsonwebtoken');

const mongooseVar = require('mongoose');

userSchema = new mongooseVar.Schema({
    name:{
        type:String,
        required: [true, 'Name is required.']
    },
    email:{
        type: String,
        required: [true, 'Email is required.']
    },
    phone:{
        type: String,
        required: [true, 'Phone number is required.']
    },
    password:{
        type: String,
        required: [true, 'Password is required.']
    },
    isVerified:{
        type:Boolean,
        default:false
    }
});

//Added method before compiling schema into model
userSchema.methods.generateToken = function (){
    return jwt.sign({id:this._id},process.env.SECRET_KEY,{expiresIn: '1d'});
}

module.exports = {
    userModel
}