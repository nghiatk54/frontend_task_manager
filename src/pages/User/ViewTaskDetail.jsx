import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPath";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import InfoBox from "@/components/Boxes/InfoBox";
import moment from "moment";
import AvatarGroup from "@/components/Group/AvatarGroup";
import { priorityMap, statusMap } from "@/utils/mapData";
import TodoCheckList from "@/components/Lists/TodoCheckList";
import Attachment from "@/components/Lists/Attachment";
function ViewTaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "in_progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };
  // get task info by id
  const getTaskDetailsById = async (id) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASK.GET_TASK_BY_ID(id)
      );
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task details", error);
    }
  };
  // handle todo checklist
  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...(task?.todoChecklist || [])];
    const taskId = id;
    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
      try {
        const response = await axiosInstance.put(
          API_PATHS.TASK.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        if (response.status == 200) {
          setTask(response.data?.task || task);
        } else {
          // Optionally revert the toggle if the API call fails
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        console.error("Error updating todo checklist", error);
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    }
  };
  // handle attachment link click
  const handleLinkClick = (link) => {
    let pattern = /^(https?:\/\/)/i;
    if (pattern.test(link)) {
      window.open(link, "_blank");
    } else {
      window.open(`https://${link}`, "_blank");
    }
  };
  useEffect(() => {
    if (id) {
      getTaskDetailsById(id);
    }
    return () => {};
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">
                  {task?.title}
                </h2>
                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status ? statusMap[task?.status] : "N/A"}
                </div>
              </div>
              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Priority"
                    value={task?.priority ? priorityMap[task?.priority] : "N/A"}
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>
                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((user) => user?.profileImageUrl) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>
                {task?.todoChecklist?.map((todo, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={todo.text}
                    isChecked={todo?.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>
              {task?.attachments?.length > 0 && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>
                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ViewTaskDetail;
