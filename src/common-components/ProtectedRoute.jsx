import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  // Check if we have result data in the location state
  const hasValidAccess = sessionStorage.getItem("testSubmitted") === "true";

  if (!hasValidAccess) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;