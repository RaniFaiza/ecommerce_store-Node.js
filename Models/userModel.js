//import packages
const jwt = require('jsonwebtoken');
const validatorpkg = require('validator');
const mongooseVar = require('mongoose');
const bcrypt = require('bcrypt');

userSchema = new mongooseVar.Schema({
    name:{
        type:String,
        required: [true, 'Name is required.'],
        minlength:[2,'Name must be atleast 2 characters'],
        trim:true
    },
    email:{
        type: String,
        required: [true, 'Email is required.'],
        unique:true,
        lowercase:true,
        validate:{
            validator: validatorpkg.isEmail,
            message:'Please provide a valid email.'
        }
    },
    phone:{
        type: String,
        required: [true, 'Phone number is required.'],
        validate:{
            validator: function(v){
                return /^[0-9]{10,15}$/.test(v)
            },
            message: 'Please Enter a valid phone number.'
        }
    },
    password:{
        type: String,
        required: [true, 'Password is required.'],
        //minlength:[6, 'Password must be at least 6 characters.'],
        validate:{
            validator: function(v){
                return validatorpkg.isStrongPassword(v,{
                    minLength: 8,
                    minUppercase: 1,
                    minLowercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    returnScore: false,
                })
            },
            
            message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.'
        },
        select: false
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

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})
const userModel = mongooseVar.model('users', userSchema);
module.exports = {
    userModel
}