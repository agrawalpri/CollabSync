const User  = require("../models/User");
// const bcrypt  = require("bcrypt.js");
const bcrypt = require("bcryptjs");

const jwt  = require("jsonwebtoken");

// generate jwt token
const generateToken = (userId) =>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"});

};

// @desc  register a new user
//@router post/api/auth/register
//@access Public
const registerUser =async (req,res) => {
    try {
        const {  name, email, password,profileImageUrl, adminInviteToken } =
        req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({message: "Name, email, and password are required"});
        }

        if (password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters long"});
        }

        // check if user already exists
        const userExists = await User.findOne({ email });

        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }
       // determin user role: admin if correct token is provided ,otherwise memeber
       let role= "member";
       if(
        adminInviteToken  &&
        adminInviteToken== process.env.ADMIN_INVITE_TOKEN
       ){
        role="admin";
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password, salt);

        // create new user
        const user =await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });
      
        // return user data with JWT
        res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token: generateToken(user._id),
        });

    }   catch (error){
            res.status(500).json({message : "Server error", error: error.message});
        
    } 
};


// @desc  login user
//@router post/api/auth/login
//@access Public
const loginUser =async (req,res) => {

     try {
        const {email, password}=req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
             return res.status(401).json({message:"Invalid email or password"});
        }


         // return user data with JWT
        res.json({
            _id:user._id,
            name: user.name,
            email: user.email,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token: generateToken(user._id),
        });


    }    catch (error){
            res.status(500).json({message : "Server error", error: error.message});
        
    } 
};


// @desc  user profile
//@router post/api/auth/profile
//@access private (requires JWT)
const getUserProfile =async (req,res) => {

     try {

    const  user = await User.findById(req.user._id).select("-password");
    if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json(user);
    
    }    catch (error){
            res.status(500).json({message : "Server error", error: error.message});
        
    } 
};


// @desc  update user profile
//@router post/api/auth/profile
//@access private (requires JWT)
const updateUserProfileUser =async (req,res) => {

     try {
        const  user = await User.findById(req.user._id);


          if(!user){
            return res.status(404).json({message:"User not found"});
        }

        user.name=req.body.name|| user.name;
        user.email =req.body.email || user.email;

        if(req.body.password){
        const salt= await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(req.body.password, salt);
        }

        const  updateUser= await user.save();

        res.json({
            _id:updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role:updateUser.role,
            profileImageUrl:updateUser.profileImageUrl,
            token: generateToken(updateUser._id),
        });


    }    catch (error){
            res.status(500).json({message : "Server error", error: error.message});
    } 
};


module.exports={ registerUser, loginUser, getUserProfile, updateUserProfileUser};

        