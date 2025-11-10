import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Label, Button } from "reactstrap";
import { AppDispatch, RootState } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";

interface ZoneOption {
  label: string;
  value: string;
}

interface ComDropDownProps {
  onZoneChange?: (zone: ZoneOption | null) => void;
}

const ComDropDown: React.FC<ComDropDownProps> = ({ onZoneChange }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data || {}
  );
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data || {}
  );

  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [selectedZone, setSelectedZone] = useState<ZoneOption | null>(null);

  // 🔹 Fetch zones when accessType is ALL
  useEffect(() => {
    if (accessType !== "ALL" || !user_id) return;

    const fetchZones = async () => {
      const userType =
        localStorage.getItem("uIdType") === "Employee" ? "EMP" : "APN";

      const payload = {
        user_id,
        option: "zone",
        userType,
        zone: "ALL",
      };

      try {
        dispatch(showLoader("Please wait, we are processing your request..."));

        const res = await apiServices.getDropDown(payload);

        if (res?.status === 200 && Array.isArray(res.data)) {
          const zoneOptions: ZoneOption[] = res.data.map((item: any) => ({
            label: item.itemDesc,
            value: item.itemVal,
          }));

          setZones(zoneOptions);

          // Pre-select a default zone (index 0 or 8 if exists)
          const preselected =
            zoneOptions.length > 8 ? zoneOptions[8] : zoneOptions[0] || null;
          setSelectedZone(preselected);
          if (typeof onZoneChange === "function") {
            onZoneChange(preselected);
          }
        }
      } catch (err: any) {
        console.error("Error fetching zones:", err);
        ShowToast("error", "Failed to load zones. Please try again later.");
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchZones();
  }, [dispatch, user_id, accessType]);

  // 🔹 Notify parent when user changes zone
  useEffect(() => {
    if (typeof onZoneChange === "function") {
      onZoneChange(selectedZone);
    }
  }, [selectedZone]);

  if (accessType !== "ALL") return null;

  return (
    <Col xs="auto">
      <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
        <Label className="form-label text-muted label-font mb-0">Zone</Label>
        <div
          className="d-flex flex-nowrap gap-2 overflow-auto mt-1"
          style={{ maxWidth: "100%" }}
        >
          {zones.map((zone) => {
            const isSelected = selectedZone?.value === zone.value;
            return (
              <Button
                key={zone.value}
                type="button"
                style={{
                  minWidth: "60px",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  border: "1px solid #11395c",
                  backgroundColor: isSelected ? "#11395c" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#11395c",
                }}
                onClick={() => setSelectedZone(zone)}
              >
                {zone.label}
              </Button>
            );
          })}
        </div>
      </div>
    </Col>
  );
};

export default ComDropDown;
