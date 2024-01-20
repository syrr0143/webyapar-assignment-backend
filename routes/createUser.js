const express = require('express');
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user') 
const Admin = require('../model/admin')
const adminMiddleware =require('../middleware/adminMiddleware')
const userMiddleware =require('../middleware/userMiddleware') 
const router = express.Router();
require('dotenv').config();
// signup router for the admin  is /signup
router.post ('/AdminSignup',async(req,res)=>{
    try {
        console.log("request received for signup :", req.body);
        const {FullName , Password,adminId  } = req.body;

        // check if the emailAddress is already used for signup process 
        const existingAdmin = await Admin.findOne({adminId});

        if(existingAdmin){
            return res.status(400).json({error:"Username with same adminid already have an account , login instead", existingAdmin});

        }

        //create a new user if email is not taken already 
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newAdmin = new Admin ({FullName ,Password:hashedPassword ,adminId });
        
        await newAdmin.save();
        return res.status (201).json({message:'Admin registered successfully '});

    } catch (error) {
        console.error(error);
        return res.status(500).json({error:'internal server error ', details :error.message});

    }
});

router.post('/AdminLogin',async (req,res)=>{
    try {
        const {adminId, Password }= req.body;
        // check if the user with email exists or not 

        const admin = await Admin.findOne ({adminId});
        console.log(admin);
        if(!admin){
            return res.status(401).json({error:'Invalid credentials '});

        }

        const passwordMatch = await bcrypt.compare(Password, admin.Password);
        

        if (passwordMatch) {
            console.log("password matched")
        }
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // generate a jwt token 
        const token = jwt.sign({adminId:admin._id},process.env.TOKEN_SECRET,{expiresIn:'7d'});

        // set the token as an cookie 
         res.cookie('token',token,{httpOnly:true,maxage:604800000});

        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({error:'internal server error '});
    }
});


// signup or add new user  router for the user   is /signup
router.post ('/UserSignup',async(req,res)=>{
    try {
        console.log("request received for signup :", req.body);
        const {FullName , Password ,UserId,Photo} = req.body;

        // check if the emailAddress is already used for signup process 
        const existingUser = await User.findOne({UserId});

        if(existingUser){
            return res.status(400).json({error:"Username with same roll number already have an account , login instead", existingUser});

        }
        const hashedPassword = await bcrypt.hash(Password, 10);

        //create a new user if email is not taken already 

        const newUser = new User ({FullName , Password:hashedPassword ,UserId,Photo});
        
        await newUser.save();
        return res.status (201).json({message:'user registered successfully '});

    } catch (error) {
        console.error(error);
        return res.status(500).json({error:'internal server error ', details :error.message});

    }
});

// login routerr for the user 
router.post('/UserLogin',async (req,res)=>{
    try {
        const {UserId, Password }= req.body;
        // check if the user with email exists or not 

        const user = await User.findOne ({UserId});
        console.log(user);
        if(!user){
            return res.status(401).json({error:'Invalid credentials '});

        }
        const PasswordMatch = await bcrypt.compare(Password, user.Password);

        if (!PasswordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // generate a jwt token 
        console.log("Password matched")
        const token = jwt.sign({UserId:user._id},process.env.TOKEN_SECRET,{expiresIn:'7d'});

        // set the token as an cookie 
      res.cookie('token',token,{httpOnly:true,maxage:604800000});

       return res.status(200).json({ message: `Login successful for the user with user id : ${user._id}`, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({error:'internal server error '});
    }
});


// Example protected route using authMiddleware
router.get('/protected-route', userMiddleware, (req, res) => {
    // This route is protected, only accessible with a valid token
    res.status(200).json({ message: 'Protected route accessed successfully' });
  });
  router.get('/protected-routes', adminMiddleware, (req, res) => {
    // This route is protected, only accessible with a valid token
    res.status(200).json({ message: 'Protected route accessed successfully' });
  });
  
  module.exports = router;