import { useEffect, useState } from "react";

const useZoomLevel = () => {
  const [zoom, setZoom] = useState<number>(window.devicePixelRatio * 100);

  useEffect(() => {
    const updateZoom = () => setZoom(window.devicePixelRatio * 100);

    window.addEventListener("resize", updateZoom);
    window.addEventListener("mousemove", updateZoom); // captures zoom via Ctrl + scroll

    return () => {
      window.removeEventListener("resize", updateZoom);
      window.removeEventListener("mousemove", updateZoom);
    };
  }, []);

  return zoom;
};

export default useZoomLevel;
