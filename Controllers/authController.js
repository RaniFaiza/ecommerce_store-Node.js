//import files
const {userModel} = require('../Models/userModel');
const {addressModel} = require('../Models/addressModel');
const {countryModel} = require('../Models/countryModel');
const {useraddressModel} = require('../Models/useraddressModel');
const {sendVerificationEmail} = require('../utils/email');
const agenda = require('../agenda/agenda');
const {customError} = require('../utils/customError');

// import packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ************************ Show registration form ************************
 async function userregistershow(req,resp){
    await resp.status(200).send({message:'Show Register.'});
}

// ************************ Register user ************************
async function userregister(req, resp, next){
    //try{
        const {
            name, email, phone, 
            password, street, town, 
            postal_code, country
        } = req.body;

        // Validate required fields
        if(!name || !phone || !email || !password || !street || !country || !town){
            return next(new customError(`Provide all mandatory fields.`, 400))
        }

        // Check if the country exists
        const iscountry = await countryModel.findOne({country_name:country});
        if(!iscountry){ 
            return next(new customError(`Country ${country} doesn't exist.`, 400))
        } 
           
        // Check if user already exists
        const existinguser = await userModel.findOne({email});
        if(existinguser){
            return next(new customError(`Email already exists.`,409));
        }
        
        // Hash Password
        const hashpassword = await bcrypt.hash(password,10);

        // Create user    
        const newuser = await userModel.create({
            name,
            phone,
            email,
            password:hashpassword,
            isVerified:false
        });

        if(!newuser){
            return next(new customError(`Error while creating user.`,500))
        }

        // Create address
        const address = await addressModel.create({
            street,
            town,
            postal_code,
            country_id:iscountry._id
        });

        // Associate user and address
        const useraddress = await useraddressModel.create({
            user_id: newuser._id,
            address_id: address._id
        });
         try{
            // // Send Verifiction Email
            //sendVerificationEmail(newuser);
              await agenda.now('send verification email',{user:newuser});
              
         } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
         }
        // Respond with success
        return resp.status(201).json({
            success: true,
            message:`User created scuccessfully. Verification Email sent.`
        })
}

//************************ Verify Email ************************
async function verifyEmail(req,resp){

        const {token} = req.query;

        // check for verification token
        if(!token){
            return next(new customError(`Verification token missing.`,400))
        }

        //Extract user id
        const {id} = jwt.verify(token, process.env.EMAIL_SECRET_KEY);
        
        // Check user existance in the database
        const user = await userModel.findById(id);
       
        if(!user){
            return next(new customError(`User not found.`,401))       
        }
        user.isVerified = true;

        await user.save();
        
        resp.status(200).json({ success: true, message: 'Email verified successfully.' });

}


//Show user login form
async function showlogin(req,resp){
    return resp.send(`Show login form.`);
}

// ************************ Login user ************************
async function login(req,resp){

    const{email, password} = req.body;

    //Validate required fields
    if(!email || !password){
        return next(new customError(`Enter all mandatory fields.`,401));
    }

    //Check if user exists
    const user = await userModel.findOne({email});

    if(user){
        //Verify password
        const verifiedpassword = await bcrypt.compare(password,user.password);
        
        //Failure response
        if(!verifiedpassword){
            return next(customError(`Email or Password incorrect.`,401));
        }   

        //Generate Token using user instance
        const token = user.generateToken()
        
        //Success response
        return resp.status(200).send({
            success:true,
            message:`${user.name} Login Successfully.`,
            token
        })
    }

    //Failure response if user doesn't exist
    return next(customError(`Email or Password incorrect.`,401));
}

module.exports = {
    userregistershow,
    userregister,
    showlogin,
    login,
    verifyEmail,
}



