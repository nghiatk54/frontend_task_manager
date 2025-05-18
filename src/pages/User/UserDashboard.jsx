import useUserAuth from "@/hooks/useUserAuth";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/userContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPath";
import moment from "moment";
import { addThousandSeparator } from "@/utils/helper";
import InfoCard from "@/components/Cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "@/components/Tables/TaskListTable";
import CustomPieChart from "@/components/Charts/CustomPieChart";
import CustomBarChart from "@/components/Charts/CustomBarChart";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

function UserDashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // prepare data for charts
  const prepareChartData = (data) => {
    const taskDistribution = data?.charts?.taskDistribution || null;
    const taskPriorityLevels = data?.charts?.taskPriorityLevels || null;
    const taskDistributionData = [
      { status: "pending", count: taskDistribution?.pending || 0 },
      { status: "in_progress", count: taskDistribution?.in_progress || 0 },
      { status: "completed", count: taskDistribution?.completed || 0 },
    ];
    setPieChartData(taskDistributionData);
    const taskPriorityLevelsData = [
      { priority: "low", count: taskPriorityLevels?.low || 0 },
      { priority: "medium", count: taskPriorityLevels?.medium || 0 },
      { priority: "high", count: taskPriorityLevels?.high || 0 },
    ];
    setBarChartData(taskPriorityLevelsData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASK.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/task");
  };

  useEffect(() => {
    getDashboardData();
    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.pending || 0
            )}
            color="bg-violet-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.in_progress || 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserDashboard;
