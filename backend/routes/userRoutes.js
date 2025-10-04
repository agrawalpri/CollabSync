// const express =require("express");
// const { adminOnly, protect} =require("../middlewares/authMiddleware");
// const { getUser } = require("../controllers/userController");

// const router = express.Router();

// // user management routes

// router.get("/",protect, adminOnly, getUser); // get all user (admin only)
// router.get("/:id",protect, getUserById); // get a specific user
// // router.delete("/:id",protect, adminOnly, deleteUser); // delete user (admin only)


// module.exports = router;


const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUsersById, deleteUser } = require("../controllers/userController");

const router = express.Router();

// user management routes
router.get("/", protect, adminOnly, getUsers);       // get all users (admin only)
router.get("/:id", protect, getUsersById);           // get a specific user
router.delete("/:id", protect, adminOnly, deleteUser); // delete user (admin only)

module.exports = router;
