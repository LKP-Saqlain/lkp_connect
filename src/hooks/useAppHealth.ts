import { useEffect, useRef, useState } from "react";

export const useAppHealth = () => {
  const [serverOnline, setServerOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentVersion = useRef<string | null>(null);

  const checkServer = async () => {
    try {
      const res = await fetch("/favicon.png", { cache: "no-store" });

      if (res.ok) {
        if (!serverOnline) {
          setServerOnline(true);
        }
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    }
  };

  const checkVersion = async () => {
    try {
      const response = await fetch("/version.json", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!currentVersion.current) {
        currentVersion.current = data.version;
      } else if (currentVersion.current !== data.version) {
        setUpdateAvailable(true);
      }
    } catch {
      // ignore version check errors
    }
  };

  useEffect(() => {
    checkServer();
    checkVersion();
  }, []);

  useEffect(() => {
    if (!serverOnline) {
      retryIntervalRef.current = setInterval(() => {
        checkServer();
      }, 10000);
    } else {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }

      const versionInterval = setInterval(() => {
        checkVersion();
      }, 60000);

      return () => clearInterval(versionInterval);
    }
  }, [serverOnline]);

  return { serverOnline, updateAvailable };
};
