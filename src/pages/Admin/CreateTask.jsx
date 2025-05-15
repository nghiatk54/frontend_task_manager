import DashboardLayout from "@/components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "@/utils/data";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import { useState, useEffect, useCallback } from "react";
import SelectDropdown from "@/components/Inputs/SelectDropdown";
import SelectUsers from "@/components/Inputs/SelectUsers";
import TodoListInput from "@/components/Inputs/TodoListInput";
import AddAttachmentsInput from "@/components/Inputs/AddAttachmentsInput";
import Modal from "@/components/Modals/Modal";
import DeleteAlert from "@/components/Alerts/DeleteAlert";

function CreateTask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };
  // create task
  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));
      const response = await axiosInstance.post(API_PATHS.TASK.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });
      toast.success(response.data.message);
      clearData();
    } catch (error) {
      console.error("Error creating task", error);
    } finally {
      setLoading(false);
    }
  };
  // update task
  const updateTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });
      const response = await axiosInstance.put(
        API_PATHS.TASK.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: todoList,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating task", error);
    } finally {
      setLoading(false);
    }
  };
  // delete task
  const deleteTask = async () => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.TASK.DELETE_TASK(taskId)
      );
      setOpenDeleteAlert(false);
      toast.success(response.data.message);
      navigate("/admin/task");
    } catch (error) {
      console.error(
        "Error deleting task",
        error.response?.data?.message || error.message
      );
    }
  };
  // handle submit
  const handleSubmit = async () => {
    setError(null);
    // Input validation
    if (!taskData.title.trim()) {
      setError("Task title is required");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required");
      return;
    }
    if (taskData.assignedTo?.length == 0) {
      setError("Task not assigned to any member");
      return;
    }
    if (taskData.todoChecklist?.length == 0) {
      setError("Add at least one todo task");
      return;
    }
    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };
  // get task info by id
  const getTaskDetailsById = useCallback(async (taskId) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASK.GET_TASK_BY_ID(taskId)
      );
      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);
        setTaskData((prev) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching task details", error);
    }
  }, []);
  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
  }, [taskId, getTaskDetailsById]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create App UI"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
                className="form-input"
              />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe task"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
                className="form-input"
              />
            </div>
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  placeholder="Create App UI"
                  type="date"
                  className="form-input"
                  value={taskData.dueDate ?? ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}
            <div className="flex justify-end mt-7">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="add-btn"
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default CreateTask;
