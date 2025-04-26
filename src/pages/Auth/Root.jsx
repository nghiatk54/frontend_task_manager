import { UserContext } from "@/contexts/userContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

function Root() {
  const { user, loading } = useContext(UserContext);
  if (loading) return <Outlet />;
  if (!user) {
    return <Navigate to="/login" />;
  }
  return user.role == "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
}
export default Root;
