import { Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

interface PrivateRouteProps {
  authElement?: JSX.Element;
  dasheElement?: JSX.Element;
  customLogin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  authElement,
  customLogin,
  dasheElement,
}) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = Boolean(localStorage.getItem("Id")); // Check for authentication token
  const hasAuthenticatedSuccessfully = Boolean(
    localStorage.getItem("authenticated")
  ); // Check if user has successfully logged in

  useEffect(() => {
    // Check authentication state on component mount
    const isLoggedIn = Boolean(localStorage.getItem("authenticated"));
    setIsUserLoggedIn(isLoggedIn);
    console.log(isUserLoggedIn);

    // Redirect to the login page if the user tries to access a restricted route
    if (customLogin && isLoggedIn) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
    }
  }, [customLogin, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }
  if (hasAuthenticatedSuccessfully) {
    return dasheElement;
  }
  // Allow access if authenticated
  if (isAuthenticated) {
    return authElement ? authElement : <Navigate to="/" replace />;
  }
  // Render dasheElement if authenticated but not authorized for the dashboard
  return dasheElement ? dasheElement : <Navigate to="/" replace />;
};

export default PrivateRoute;
