const multer = require('multer');

// configure storage

const storage = multer.diskStorage({
    destination: (req,res,cb) =>{
        cb(null,'uploads/');  //save in uploads folder 
    },
    filename: (req, res,cb) =>{
        cb(null,`${Date.now()}-${file.orginalname}`);
    },
});


//file filter

const fileFilter =(req, res,cb) =>{
    const  allowedTypes =["image/jpeg, image/jpg,image/png"];
    if(allowedTypes.includes(file.minetype)){
        cb(null,true);
    }else{
        cb(new Error('Only .jpeg, .jpg  and .png formats are allowed'),false );
    }
};

const upload= multer({storage,fileFilter});

module.exports =upload;