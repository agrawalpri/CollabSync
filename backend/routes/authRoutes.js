const express=require("express");
const {registerUser, loginUser,getUserProfile, updateUserProfileUser}=require("../controllers/authController");
const {protect} = require("../middlewares/authMiddleware");
const upload= require("../middlewares/uploadMiddleware")
const router=express.Router();

// auth router
router.post("/register", registerUser);  // register user
router.post("/login", loginUser);  // login user
router.post("/profile", protect, getUserProfile);  // get user profile
router.post("/profile",protect, updateUserProfileUser);  // update profile


router.post("/upload-image", upload.single("image"), (req, res) =>{
    if(!req.file){
        return res.status(400).json({message :"No file uploaded"});

    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({imageUrl});
    
    });

module.exports= router;
