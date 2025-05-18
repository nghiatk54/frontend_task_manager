import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPath";
import TaskStatusTabs from "@/components/Group/TaskStatusTabs";
import TaskCard from "@/components/Cards/TaskCard";

function MyTask() {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const getAllTasks = useCallback(async (filterStatus) => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASK.GET_ALL_TASKS, {
        params: {
          status: filterStatus == "All" ? "" : filterStatus,
        },
      });
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);
      // map status summary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        {
          label: "All",
          count: statusSummary.all || 0,
        },
        {
          label: "Pending",
          count: statusSummary.pendingTasks || 0,
        },
        {
          label: "In Progress",
          count: statusSummary.inProgressTasks || 0,
        },
        {
          label: "Completed",
          count: statusSummary.completedTasks || 0,
        },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }, []);
  const handleClick = (taskId) => {
    navigate(`/user/task-detail/${taskId}`);
  };
  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus, getAllTasks]);
  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl font-medium">My Tasks</h2>
          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => handleClick(item._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyTask;
