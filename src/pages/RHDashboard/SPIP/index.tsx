import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Card, CardHeader, CardBody, Button } from "reactstrap";
import { Tabs, Tab } from "@mui/material";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ComDropDown from "../../../components/common/Dropdown/commonDropdown";
import UserInfoTable from "../../../components/common/UserInfoTable";

/* ---------------- TYPES ---------------- */

type BranchType = "EMP" | "APN" | "B2B";

/* ---------------- CONFIG ---------------- */

const TAB_CONFIG = [
  {
    label: "Q4",
    optionType: "Q4",
    period: "January–March",
  },
];

const BRANCH_CONFIG: {
  key: BranchType;
  label: string;
  activeBg: string;
  activeColor: string;
  border: string;
}[] = [
  {
    key: "EMP",
    label: "Employee",
    activeBg: "#11395C",
    activeColor: "#fff",
    border: "#11395C",
  },
  {
    key: "APN",
    label: "Partner",
    activeBg: "#F57C00",
    activeColor: "#fff",
    border: "#F57C00",
  },
  {
    key: "B2B",
    label: "B2B",
    activeBg: "#2E7D32",
    activeColor: "#fff",
    border: "#2E7D32",
  },
];

/* ---------------- COMPONENT ---------------- */

const SpipReport = ({ activeSubItem }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const [tabValue, setTabValue] = useState(0);
  const [activeBranch, setActiveBranch] = useState<BranchType>("EMP");
  const [selectedZone, setSelectedZone] = useState("all");

  const { user_id } = useSelector((s: RootState) => s.UserLogin?.data?.data);
  const { accessType } = useSelector(
    (s: RootState) => s.AuthUser?.data?.data || {}
  );
  const onlyDigits = user_id.replace(/\D/g, "");
  // const [userData, setUserData] = useState<UserData>({
  //   EMPLOYEE: [],
  //   PARTNER: [],
  //   B2B: [],
  // });
  const [userData, setUserData] = useState(
    []
    // EMPLOYEE: [],
    // PARTNER: [],
    // B2B: [],
  );

  /* ---------------- API ---------------- */

  useEffect(() => {
    console.log(`${activeSubItem}  ${selectedZone} ${activeBranch}`, "SPIPP");

    if (accessType === "ALL" && selectedZone === "all") return;

    const fetchReport = async () => {
      dispatch(showLoader(""));

      try {
        const res = await apiServices.GetContestSummary({
          userType: activeBranch,
          userId: onlyDigits,
          zone: selectedZone,
          quarterPeriod: "Q4",
        });

        if (res?.data?.statusCode === 200) {
          // const { employee = [], partner = [], b2b = [] } = res.data.data || {};
          console.log(res?.data?.data, "spipp");
          // setUserData({
          //   EMPLOYEE: employee.map((d: any, i: number) => ({
          //     ...d,
          //     Id: i + 1,
          //   })),
          //   PARTNER: partner.map((d: any, i: number) => ({ ...d, Id: i + 1 })),
          //   B2B: b2b.map((d: any, i: number) => ({ ...d, Id: i + 1 })),
          // });
          const data = res?.data?.data.map((d: any, i: number) => ({
            ...d,
            Id: i + 1,
          }));
          setUserData(data);
        }
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchReport();
  }, [tabValue, selectedZone, accessType, user_id, activeBranch, dispatch]);

  /* ---------------- UI ---------------- */

  return (
    <div className="page-content page-view">
      <Container fluid>
        {/* --------- Dynamic Tabs --------- */}
        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            marginTop: "1rem",
            marginLeft: ".7rem",
            marginBottom: "8px",
            backgroundColor: "white",
            borderRadius: "11px",
            width: "fit-content",
            minHeight: 0,
          }}
        >
          {TAB_CONFIG.map((tab, index) => (
            <Tab
              key={tab.label}
              label={tab.label}
              disableRipple
              sx={{
                textTransform: "none",
                fontWeight: 400,
                borderRadius: "10px",
                px: 3,
                minHeight: 10,
                backgroundColor: tabValue === index ? "#11395C" : "white",
                color: tabValue === index ? "white" : "#11395C",
                "&.Mui-selected": {
                  color: "white !important",
                },
              }}
            />
          ))}
        </Tabs>

        {accessType === "ALL" && (
          <ComDropDown
            onZoneChange={(z: any) => setSelectedZone(z?.value || "all")}
          />
        )}

        {/* --------- CARD --------- */}
        <Card
          className="mt-3"
          style={{
            minHeight: "80vh",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <div className="d-flex justify-content-between">
              <h4 className="card-title mb-0">
                SPIP Contest Report{" "}
                <span style={{ fontSize: "12px" }}>
                  ({TAB_CONFIG[tabValue].period})
                </span>
              </h4>

              {/* --------- Branch Buttons --------- */}
              <div style={{ display: "flex", gap: "8px" }}>
                {BRANCH_CONFIG.map((b) => (
                  <Button
                    key={b.key}
                    onClick={() => setActiveBranch(b.key)}
                    style={{
                      backgroundColor:
                        activeBranch === b.key ? b.activeBg : "#fff",
                      color: activeBranch === b.key ? b.activeColor : b.border,
                      border: `1px solid ${b.border}`,
                      minWidth: "90px",
                      fontSize: "14px",
                      borderRadius: "6px",
                    }}
                  >
                    {b.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardBody>
            <UserInfoTable
              T6Data={userData}
              // activeSubItem={`${activeSubItem} ${activeBranch}`}
              activeSubItem={activeSubItem}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default SpipReport;
