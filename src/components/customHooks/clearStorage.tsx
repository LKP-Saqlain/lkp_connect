import { useEffect } from "react";

const useClearStorageOnTabClose = () => {
  useEffect(() => {
    const handleUnload = () => {
      if (document.visibilityState === "hidden") {
        localStorage.clear(); // Clear local storage
        sessionStorage.clear(); // Clear session storage
      }
    };

    window.addEventListener("visibilitychange", handleUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("visibilitychange", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);
};

export default useClearStorageOnTabClose;
