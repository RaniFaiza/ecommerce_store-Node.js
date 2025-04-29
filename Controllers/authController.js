//import files
const {userModel} = require('../Models/userModel');
const {addressModel} = require('../Models/addressModel');
const {countryModel} = require('../Models/countryModel');
const {useraddressModel} = require('../Models/useraddressModel');
const {sendVerificationEmail} = require('../utils/email');

// import packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ************************ Show registration form ************************
 async function userregistershow(req,resp){
    await resp.status(200).send({message:'Show Register.'});
}

// ************************ Register user ************************
async function userregister(req, resp){
    try{
        const {
            name, email, phone, 
            password, street, town, 
            postal_code, country
        } = req.body;

        // Validate required fields
        if(!name || !phone || !email || !password || !street || !country || !town){
        return resp.status(400).json({
            success: false,
            message:'Provide all mandatory fields.'});
        }

        // Check if the country exists
        const iscountry = await countryModel.findOne({country_name:country});
        if(!iscountry){
            return resp.status(404).json({
                success: false,
                message:`Country ${country} doesn't exist. `});  
        } 
           
        // Check if user already exists
        const existinguser = await userModel.findOne({email});
        if(existinguser){
            resp.status(409).json({
                success: true,
                message:'Email already exists.'});
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
            return resp.status(500).json({
                success: false,
                message:`Error while creating user`});
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
        
        // Send Verifiction Email
        sendVerificationEmail(newuser);

        // Respond with success
        return resp.status(201).json({
            success: true,
            message:`User created scuccessfully. Verification Email sent.`
        })

} catch(error){
    console.error(`Registration Error: ${error}`);
    return resp.status(500).json({
        message: `Internal Server Error.`,
        error:error.message
    });
  }
}

//************************ Verify Email ************************
async function verifyEmail(req,resp){
    try{ 
        const {token} = req.query;

        // check for verification token
        if(!token){
            return res.status(400).json({ success: false, message: 'Verification token missing.' });
        }

        const {id} = jwt.verify(token, process.env.EMAIL_SECRET_KEY);
        
        // Check user existance in the database
        const user = await userModel.findById(id);
       
        if(!user){
            return resp.status(401).json({
            success: false,
            message:`User not found.`
            })
        }
        user.isVerified = true;
        await user.save();
        resp.status(200).json({ success: true, message: 'Email verified successfully.' });

    }catch(error){
        return resp.status(500).json({
        message: `Internal Server Error.`,
        error:error.message
    });
    }

}

//Show user login form
async function showlogin(req,resp){
    return resp.send(`Show login form.`);
}

// ************************ Login user ************************
async function login(req,resp){
    try{
    const{email, password} = req.body;

    //Validate required fields
    if(!email || !password){
        return resp.status(401).send(`Enter all mandatory fields.`);
    }

    //Check if user exists
    const user = await userModel.findOne({email});

    if(user){
        //Verify password
        const verifiedpassword = await bcrypt.compare(password,user.password);
        
        //Failure response
        if(!verifiedpassword){
            return resp.status(401).send({
                success:false,
                message:`Email or Password incorrect. `
            });
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
    return resp.status(404).send({
        success:true,
        message:`Email or Password incorrect. .`
    })

    }catch(error){
        console.error(`Error while login: ${error}`);
        return resp.status(500).send({
            success:false,
            message: `Internal Server Error: ${error}`
        })
    }
  

}

module.exports = {
    userregistershow,
    userregister,
    showlogin,
    login,
    verifyEmail,
}



