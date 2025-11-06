// const Task=require("../models/Task");
// const User=require("../models/User");
// const bcrypt=require("bcryptjs");


// //@desc get all user (admin only)
// // @router get/api/users
// // @access private (admin)
// const getUsers= async (req, res) =>{
//     try{
//         const  user =await User.find({role: 'member'}).select("-password");
       
        

//     // addtask counts to each user 
//     const userWithTaskCounts  = await Promise.all(
//         users.map(async(user)=>{
//             const pendingTasks =await Task.countDocuments({
//                 assignedTo: user._id,
//                 status: "Pending",
//             });

//              const inProgressTasks =await Task.countDocuments({
//                 assignedTo: user._id,
//                 status: "In Progress",
//         });

//          const completedTasks =await Task.countDocuments({
//                 assignedTo: user._id,
//                 status: "Completed",

//     });  
    
//     return{
//         ...user._doc,
//         pendingTasks,
//         inProgressTasks,
//         completedTasks,
//     };

// }));
//     res.json(userWithTaskCounts);
    
//     }catch(error){
//             res.status(500).json({message: "server error",error: error.message});

//         }
//     };


// //@desc get user id 
// // @router get/api/users/:id
// // @access private 
// const getUsersById = async (req, res) =>{
//     try{

//         const  user =await User.findById(req.params.id).select("-password");
//         if(!user) return  res.status(404).json({message:"User not found"});
//         res.json(user);
//     }catch(error){
//             res.status(500).json({message: "server error",error: error.message});

//         }
    
// };


// //@desc DELETE  a  user id 
// // @router DELETE/api/users/:id
// // @access private(Admin) 
// const deleteUser = async (req, res) =>{
//     try{
        
//     }catch(error){
//             res.status(500).json({message: "server error",error: error.message});

//         }
    
// };

// // module.exports  ={getUsers,getUsersById, deleteUser};

//  module.exports  ={getUsers,getUsersById, deleteUser};



const Task = require("../models/Task");
const User = require("../models/User");

// @desc Get all users (admin only)
// @route GET /api/users
// @access Private (admin)
const getUsers = async (req, res) => {
  try {
    // Fetch all members
    const users = await User.find({ role: "member" }).select("-password");

    // Add task counts for each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });

        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });

        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc, // spread user document data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private
const getUsersById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @desc Delete user by ID
// @route DELETE /api/users/:id
// @access Private (admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUsers, getUsersById, deleteUser };
