const Task=require("../models/Task");

// @desc get all task (admin,user, only assigned task)
//@router get/api/tasks
//@access private

const getTasks= async(req, res)=>{
    try{
        const {status}=req.query;
        let filter={};

        if(status){
            filter.status=status;
        }
        let tasks;
        if(req.user.role=="admin"){
            tasks= await Task.find(filter).populate(
                "assignedTo",
                "name email,prfileImageUrl"
            );
        }else{
            tasks=await Task.find({...filter, assignedTo: req.user._id}).populate(
                 "assignedTo",
                "name email,prfileImageUrl"
            );
        }

        // add complete toochecklist count to each task
        tasks = await Promise.all(
        tasks.map(async(task)=>{
            const completedCount= task.todoChecklists.filter(
                (item)=>item.completed
            ).length;
            return {...task._doc,completedTodoCount:completedCount};
        })
    );


    // status summary count
    const allTaskd= await Task.countDocuments(
        req.user.role==="admin"?{}:{assignedTo:req.user._id}
    );

    const pendingTasks= await Task.countDocuments({
        ...filter,
        status:"Pending",
        ...(req.user.role !== "admin"?{}:{assignedTo:req.user._id})
    });

    const isProgressTasks= await Task.countDocuments({
        ...filter,
        status:"In Progress",
        ...(req.user.role !== "admin"?{}:{assignedTo:req.user._id})
    });

    const completedTasks= await Task.countDocuments({
        ...filter,
        status:"completed",
        ...(req.user.role !== "admin"?{}:{assignedTo:req.user._id})
    });

    res.json({
        tasks,
        statusSummary:{
            all: allTask,
            pendingTasks,
            inProgressTasks,
            completedTasks,
        },
    });

    }catch(error){
        res.status(500).json({message:"Server error",error:error.message});

    }
};


// @desc get  task by id
//@router get/api/tasks/:id
//@access private

const getTaskById= async(req, res)=>{
    try{
        const task=  await Task.findById(req.params._id).populate(
            "assignedTo",
            "name email.profileImageUrl"
        );

        if(!task) return res.status(404).json({message:"Task not found"});

        res.json(task);

    }catch(error){

    }
};



// @desc g  create new task
//@router get/api/tasks/:id
//@access private

const createTask= async(req, res)=>{
    try{
    const {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        attachments,
        todoChecklist,
            
        }=req.body;

    if(!Array.isArray(assignedTo)){
        return res
        .status(400)
        .json({message:"assignedTo must be an array of user IDs"});
    }

    const task =await Task.create({
        title,
        description,
        priority,
        dueDate,
        createdBy: req.user._id,
        todoChecklist,
        attachments,
    });

    res.status(201).json({message:"Task created successfully",task});

    }catch(error){
         res.status(500).json({message:"Server error",error:error.message});

    }
};


// @desc update task details
//@router put/api/tasks/:id
//@access private

const updateTask= async(req, res)=>{
    try{
    const task =await Task.findById(req.params.id);
    
    if(!task) return res.status(404).json({message:"Task not found"});
   
    task.title=req.body.title || task.title;
    task.description=req.body.description || task.description;
    task.priority=req.body.priority || task.priority;
    task.dueDate=req.body.dueDate || task.dueDate;
    task.todoChecklists=req.body.todoChecklist || task.todoChecklists;
    task.attachments=req.body.attachments || task.attachments;


    if(req.body.assignedTo){
        if(!Array.isArray(req.body.assignedTo)){
            return res
            .status(400)
            .json({message:"assignedTomust be an array ofuser IDs"});
        }
        task.assignedTo=req.body.isArray;
    }
    const updateTask= await task.save();
    res.json({message:"Task update Successfully", updateTask});

    }catch(error){
         res.status(500).json({message:"Server error",error:error.message});

    }
};



// @desc delete task  by admin
//@router delete/api/tasks/:id
//@access private(admin)

const deleteTask= async(req, res)=>{
    try{

    const task =await Task.findById(req.params.id);
    
    if(!task) return res.status(404).json({message:"Task not found"});
   
    await task.deleteOne();
    res.json({message:"Task deleted Successfully"});
    }catch(error){
         res.status(500).json({message:"Server error",error:error.message});

    }
};


// @desc update task status
//@router put/api/tasks/:id/status
//@access private

const updateTaskstatus= async(req, res)=>{
    try{
    const task =await Task.findById(req.params.id);
    
    if(!task) return res.status(404).json({message:"Task not found"});
        const isAssigned= task.assignedTo.some(
            (userId)=>userId.toString()  ===req.user._id.toString()
        );
        if(!isAssigned && req.user.role !=="admin"){
            return res.status(403).json({message:"Not Authorized"});
        }
        task.status=req.body.status || task.status;

        if(task.status==="Completed"){
            task.todoChecklists.forEach((item)=>(item.completed==true));
            task.progress=100;
        }

    }catch(error){
         res.status(500).json({message:"Server error",error:error.message});

    }
};


// @desc update task checklist
//@router put/api/tasks/:id/todo
//@access private

const updateTaskchecklist= async(req, res)=>{
    try{
        const {todoChecklist}=req.body;
        const task =await Task.findById(req.params.id);

          if(!task) return res.status(404).json({message:"Task not found"});

          if(!task.assignedTo.includes(req.user._id) &&  req.user.role !=="admin"){
            return res
            .status(403)
            .json({message:"Not authorized to update checklist"});
          }

          task.todoChecklists=todoChecklist // replace updated checklist
          

          // auto update progress based on checklist completed
          const completedCount= task.todoChecklists.filter(
            (item)=>item.completed
          ).length;
          const totalItem =task.todoChecklist.length;
          task.progress=
          toatlItem>0 ?Math.round((completedCount/totalItem)*100):0;

          //auto mark task as completed if all item are checked
          if(task.progress===100){
            task.satus=="In Progress";
          }else{
            task.satus="Pending";
          }
          await task.save();
          const updateTask=await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
          );
          res.json({message:"Task checklist update", task:updateTask});

    }catch(error){
         res.status(500).json({message:"Server error",error:error.message});

    }
};


// @desc dashboard databy admin only
//@router get/api/tasks.dashboard-data
//@access private

const getDashboardData= async(req, res)=>{
    try{
        // fetch statistics
        const totatlTask = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({status:"Pending"});
        const completedTask = await Task.countDocuments({status:"Completed"});
        const overdueTask = await Task.countDocuments({
            status:{$ne: "Completed"},
            dueDate:{$lt :new Date()},
        })

        // ensure all possible status are include
        const taskStatuses = ["Pending", "In Progress","Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{$sum:1},
                },
            },
        ]);

        // Fix: Use const instead of reassigning
        const taskDistribution = taskStatuses.reduce((acc, status)=>{
            const formattedKey = status.replace(/\s+/g,""); // remove spaces for response key
            acc[formattedKey] = taskDistributionRaw.find((item)=>item._id === status)?.count || 0;
            return acc;    
        }, {});
        taskDistribution["All"] = totatlTask; // add total count to taskdistribution

        // ensure all priority level are includes
        const taskPriorities = ["low","medium","high"]; // Fix: lowercase to match schema
        const taskPriorityLevelsRaw = await Task.aggregate([ // Fix: aggregate not arrregate
            {
                $group:{
                    _id:"$priority",
                    count:{$sum:1},
                },
            },
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority)=>{
            const capitalizedPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
            acc[capitalizedPriority] = taskPriorityLevelsRaw.find(
                (item)=> item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find()
            .sort({createdAt:-1})
            .limit(10)
            .select("title status priority dueDate createdAt"); // Fix: createdAt not "created At"

        res.status(200).json({
            statistics:{
                totatlTask,
                pendingTasks,
                completedTask,
                overdueTask,
            },
            charts:{
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });

    }catch(error){
        res.status(500).json({message:"Server error",error:error.message});
    }
};



// @desc dashboard data user specific
//@router get/api/tasks/user-dashboard-data
//@access private

const getUserDashboardData= async(req, res)=>{
    try{
        const userId=req.user._id;  // only fetch data  for the logged in user 

        /// fetch statistics for user specific tasks

        const totatlTask= await Task.countDocuments({assignedTo:userId});
        const pendingTasks= await Task.countDocuments({assignedTo:userId,status:"Pending"});
        const completedTask= await Task.countDocuments({assignedTo:userId,status:"Completed"});
        const overdueTask=await Task.countDocuments({
        assignedTo:userId,
        status:{$ne: "Completed"},
                dueDate:{$lt :new Date()},
         });

         // task distribution by status

        const taskStatuses= ["Pending", "In Progress","Completed"];
        const taskDistributionRaw= await Task.aggregate([
            {   $match:{
                assignedTo:userId
            }},
            { $group:{
                _id:"$status",
                count:{$sum:1}

                }
            },
         ]);

        taskDistributionRaw=taskStatuses.reduce((acc, status)=>{
        const formattedKey= status.replace(/\s+/g,"");// remove spaces for response key
        acc[formattedKey]=
        taskDistributionRaw.find((item)=>item._id === status)?.count || 0 ;
            return acc;    
        },
    {});
    taskDistribution["All"]=totatlTasks;


    // Task distribution by priority
    const taskPriorities=["Low","Medium","High"];
    const taskPriorityLevelsRaw=await Task.arrregate([
     {   $match:{
                assignedTo:userId
            }},
            { $group:{
                _id:"$priority",
                count:{$sum:1}

                }
            },
         ]);



        const taskPriorityLevels=taskPriorities.reduce((acc, priority)=>{
        acc[priority]=
        taskPriorityLevelsRaw.find(
        (item)=> item._id ===priority)?.count || 0;
        return acc;
    
    },{});


    // fetch recent 10 task for the logged-in user
    const recentTasks= await Task.find({assignedTo:userId})
    .sort({createdAt:-1})
    .limit(10)
    .select("title status priority dueDate created At");


    res.status(200).json({
        statistics:{
            totatlTask,
            pendingTasks,
            completedTask,
            overdueTask,
        },
        charts:{
        taskDistribution,
        taskPriorityLevels,
        },
        recentTasks,
    });




    }catch(error){
         res.status(500).json({message:"Server error",error:error.message});

    }
};


module.exports={
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskstatus,
    updateTaskchecklist,
    getDashboardData,
    getUserDashboardData,

};



