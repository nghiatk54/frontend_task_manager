import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPath";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "@/components/Cards/UserCard";
import toast from "react-hot-toast";
function ManageUser() {
  const [allUsers, setAllUsers] = useState([]);
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };
  // download report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_USER, {
        responseType: "blob",
      });
      // create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:items-center justify-between">
          <h2 className="text-xl font-medium">Team Members</h2>
          <button className="flex download-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManageUser;
