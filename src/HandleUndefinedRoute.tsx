import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HandleUndefinedRoutes = () => {
  const navigate = useNavigate();

  // Redirect to Home page for undefined routes
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default HandleUndefinedRoutes;
