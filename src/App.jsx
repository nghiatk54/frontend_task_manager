import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@pages/Auth/Login";
import SignUp from "@pages/Auth/SignUp";
import Dashboard from "@pages/Admin/Dashboard";
import ManageTask from "@/pages/Admin/ManageTask";
import CreateTask from "@/pages/Admin/CreateTask";
import ManageUser from "@/pages/Admin/ManageUser";
import UserDashboard from "@pages/User/UserDashboard";
import MyTask from "@/pages/User/MyTask";
import ViewTaskDetail from "@/pages/User/ViewTaskDetail";
import PrivateRoute from "@/routes/PrivateRoute";
import { UserProvider } from "@/contexts/userContext";
import Root from "@pages/Auth/Root";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/task" element={<ManageTask />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/user" element={<ManageUser />} />
            </Route>
            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["member"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/task" element={<MyTask />} />
              <Route
                path="/user/task-detail/:id"
                element={<ViewTaskDetail />}
              />
            </Route>
            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
}

export default App;
