const express =require("express");
const{protect,adminOnly}=require("../middlewares/authMiddleware");
const{getTasks, getTaskById,createTask, updateTaskstatus, updateTaskchecklist, deleteTask ,getDashboardData, getUserDashboardData,updateTask}= require("../controllers/taskController");

const router = express.Router();

// task Management routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // get all task (admin,all user assigned);
router.get("/:id", protect, getTaskById); //get task by id
router.post("/", protect,adminOnly, createTask);// create task by admin only
router.put("/:id", protect, updateTask); // upadate task details
router.delete("/:id", protect,adminOnly, deleteTask);// delete task by admin only
router.put("/:id/status", protect, updateTaskstatus);// update tsk status
router.put("/:id/todo", protect, updateTaskchecklist);// update task checklist

module.exports =router;



