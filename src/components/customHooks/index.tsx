import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("tkn");
    setIsAuthenticated(!!token); // Boolean value based on token existence
  }, []);

  return isAuthenticated;
};
