import useUserAuth from "@/hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "@/contexts/userContext";
function Dashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);
  return <div>Dashboard</div>;
}

export default Dashboard;
