

import React, { useState, useEffect, useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { IoMdCard } from "react-icons/io";
import { LuArrowRight } from "react-icons/lu";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import TaskListTable from "../../components/layouts/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import { BarChart } from "recharts";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // ✅ Prepare chart data
  const prepareChartData = (data) => {
    if (!data) return;

    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    const distributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];
    setPieChartData(distributionData);

    const priorityData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];
    setBarChartData(priorityData);
  };

  // ✅ Fetch dashboard data
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Header */}
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">
            Good Morning, {user?.name || "User"} 👋
          </h2>
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format("dddd, Do MMM YYYY")}
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 mt-5">
        <InfoCard
          icon={<IoMdCard />}
          label="Total Tasks"
          value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
          color="bg-primary"
        />
        <InfoCard
          icon={<IoMdCard />}
          label="Pending Tasks"
          value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
          color="bg-violet-500"
        />
        <InfoCard
          icon={<IoMdCard />}
          label="In Progress Tasks"
          value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
          color="bg-cyan-500"
        />
        <InfoCard
          icon={<IoMdCard />}
          label="Completed Tasks"
          value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
          color="bg-lime-500"
        />
      </div>

      {/* Chart + Recent Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium">Task Distribution</h5>
          </div>
          <CustomPieChart
          data={pieChartData}
           colors={COLORS} />
        </div>
        </div>



       <div>
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium">Task Priority Levels </h5>
          </div>
          <CustomBarChart
          data={barChartData}
           />
        </div>
        </div>







        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-lg font-medium">Recent Tasks</h5>
            <button className="card-btn flex items-center gap-1" onClick={onSeeMore}>
              See All <LuArrowRight className="text-base" />
            </button>
          </div>
          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
