import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import { useEffect, useState } from "react";

const Stage = ({ toggle, data }: any) => {
  const [statusData, setStatusData] = useState([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const GetApApplicationStatusFlow = async () => {
      const payload = {
        applNo: data.applNo, // Replace with dynamic application number
      };

      dispatch(showLoader("Fetching Details..."));

      try {
        const response = await apiServices.GetApApplicationStatusFlow(payload);
        console.log(response, "GetApApplicationStatusFlow");

        setStatusData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        dispatch(hideLoader());
      }
    };
    GetApApplicationStatusFlow();
  }, []);

  const getStageStyle = (item: any) => {
    const stepName = item.stepName?.toLowerCase() || "";

    const isInactive = item.statusDate === "0001-01-01T00:00:00";

    if (isInactive) {
      return {
        bg: "#e6e6e6",
        dot: "#bdbdbd",
        opacity: 0.6,
      };
    }

    if (stepName.includes("reject")) {
      return {
        bg: "#ffe5e5",
        dot: "#ff4d4f",
        opacity: 1,
      };
    }

    if (stepName.includes("review")) {
      return {
        bg: "#fff7d6",
        dot: "#f5b301",
        opacity: 1,
      };
    }

    if (
      stepName.includes("approved") ||
      stepName.includes("activated") ||
      stepName.includes("completed")
    ) {
      return {
        bg: "#d9f7e8",
        dot: "#00b386",
        opacity: 1,
      };
    }

    return {
      bg: "#cfe0f1",
      dot: "#095192",
      opacity: 1,
    };
  };

  return (
    <div style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          background: "#f5f6f8",
          borderRadius: "16px 16px 0 0",
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#11395C",
          fontWeight: 600,
          fontSize: 16,
          boxShadow: "0 2px 5px rgb(0 0 0 / 0.1)",
        }}
      >
        <div>Application Status</div>
        <button
          onClick={toggle}
          aria-label="Close"
          style={{
            background: "transparent",
            border: "none",
            color: "#11395C",
            fontWeight: 700,
            fontSize: 24,
            cursor: "pointer",
            lineHeight: 1,
            padding: 0,
            width: 32,
            height: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e6f0fa")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          &times;
        </button>
      </div>

      {/* Stage List */}
      <div
        style={{
          background: "#f5f6f8",
          padding: 16,
          borderRadius: "0 0 16px 16px",
        }}
      >
        {statusData.map((item: any, index) => {
          const styles = getStageStyle(item);

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: styles.bg,
                padding: "12px 14px",
                borderRadius: "12px",
                marginBottom: 10,
                opacity: styles.opacity,
              }}
            >
              {/* Left side */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: styles.dot,
                  }}
                />

                <span
                  style={{
                    fontSize: 14,
                    color: "#11395C",
                    fontWeight: 500,
                  }}
                >
                  {item.stepName}
                </span>
              </div>

              {/* Date */}
              {item.statusDate !== "0001-01-01T00:00:00" && (
                <span
                  style={{
                    fontSize: 13,
                    color: "#11395C",
                    fontWeight: 500,
                  }}
                >
                  {new Date(item.statusDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stage;
