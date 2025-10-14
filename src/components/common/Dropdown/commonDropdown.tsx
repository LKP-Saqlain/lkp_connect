import { useEffect, useState } from "react";
import { Col, Label, Row } from "reactstrap";
import Select from "react-select";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";
interface FormValues {
  selectedZone: { label: string; value: string } | null;
  selectedBranchCode: { label: string; value: string } | null;
}
const ComDropDown = ({ onSelectionChange }: any) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
      selectedBranchCode: null,
    },
    onSubmit: () => {
      //   fetchData(); // defined below
    },
  });

  // 1️⃣ Fetch Zones on Mount
  useEffect(() => {
    const fetchZones = async () => {
      const userType =
        localStorage.getItem("uIdType") === "Employee" ? "EMP" : "APN";

      const payload = {
        user_id: user_id,
        option: "zone",
        userType,
        zone: "ALL",
      };

      try {
        dispatch(showLoader("Please wait, we are processing your request..."));

        const res = await apiServices.getDropDown(payload); // ✅ No auth header here
        if (res?.status === 200) {
          const zoneOptions = res.data.map((item: any) => ({
            label: item.itemDesc,
            value: item.itemVal,
          }));

          setNoSortingGroup(zoneOptions);

          if (zoneOptions.length > 0) {
            formik.setFieldValue("selectedZone", zoneOptions[0]); // Pre-select first zone
          }
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          "Failed to load zones. Please try again later.";
        ShowToast("error", errorMessage);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchZones();
  }, [dispatch, user_id]);

  // 2️⃣ Fetch Branch Codes Based on Selected Zone (no auth header)
  useEffect(() => {
    const fetchBranches = async () => {
      if (!formik.values.selectedZone) return;

      const userType =
        localStorage.getItem("uIdType") === "Employee" ? "EMP" : "APN";

      const payload = {
        user_id: user_id,
        option: "BranchByZone",
        userType,
        zone: formik.values.selectedZone.value,
      };

      try {
        dispatch(showLoader("Please wait, we are processing your request..."));

        const res = await apiServices.getDropDown(payload); // ✅ No auth header here
        if (res?.status === 200) {
          let branchOptions = res.data.map((item: any) => ({
            label: item.itemVal,
            value: item.itemVal,
          }));
          branchOptions = [{ label: "ALL", value: "ALL" }, ...branchOptions];
          setBranchCodeOptions(branchOptions);

          if (branchOptions.length > 0) {
            formik.setFieldValue("selectedBranchCode", branchOptions[0]);
          }
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          "Failed to load branch codes. Please try again later.";
        ShowToast("error", errorMessage);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchBranches();
  }, [formik.values.selectedZone, dispatch, user_id]);

  useEffect(() => {
    onSelectionChange(
      formik.values.selectedZone,
      formik.values.selectedBranchCode
    );
  }, [formik.values.selectedZone, formik.values.selectedBranchCode]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Row>
        <Col
          xs={12}
          style={{
            flex: "0 0 auto",
            minWidth: "140px",
            maxWidth: "150px",
          }}
          className="mb-3"
        >
          <Label
            htmlFor="zone-select"
            className="form-label text-muted label-font"
          >
            Zone
          </Label>
          <Select
            value={formik.values.selectedZone}
            onChange={(option: any) =>
              formik.setFieldValue("selectedZone", option)
            }
            onBlur={formik.handleBlur}
            options={noSortingGroup}
            className="placeholder-font"
            isClearable
            id="zone-select"
            styles={{
              control: (base: any) => ({
                ...base,
                cursor: "pointer",
                minHeight: "36px",
                fontSize: "12px",
                borderColor:
                  formik.touched.selectedZone && formik.errors.selectedZone
                    ? "#DC4535"
                    : base.borderColor,
                "&:hover": {
                  borderColor:
                    formik.touched.selectedZone && formik.errors.selectedZone
                      ? "#DC4535"
                      : base.borderColor,
                },
              }),
            }}
          />
          {formik.touched.selectedZone && formik.errors.selectedZone && (
            <div className="text-danger error-msg">
              {formik.errors.selectedZone}
            </div>
          )}
        </Col>

        <Col
          xs={12}
          style={{
            flex: "0 0 auto",
            minWidth: "140px",
            maxWidth: "150px",
          }}
          className="mb-3"
        >
          <Label
            htmlFor="branch-code-select"
            className="form-label text-muted label-font"
          >
            Branch Code
          </Label>
          <Select
            value={formik.values.selectedBranchCode}
            onChange={(option) =>
              formik.setFieldValue("selectedBranchCode", option)
            }
            onBlur={formik.handleBlur}
            options={branchCodeOptions}
            className="placeholder-font"
            isClearable
            id="branch-code-select"
            styles={{
              control: (base: any) => ({
                ...base,
                cursor: "pointer",
                borderColor:
                  formik.touched.selectedBranchCode &&
                  formik.errors.selectedBranchCode
                    ? "#DC4535"
                    : base.borderColor,
                "&:hover": {
                  borderColor:
                    formik.touched.selectedBranchCode &&
                    formik.errors.selectedBranchCode
                      ? "#DC4535"
                      : base.borderColor,
                },
              }),
            }}
          />
          {formik.touched.selectedBranchCode &&
            formik.errors.selectedBranchCode && (
              <div className="text-danger error-msg">
                {formik.errors.selectedBranchCode}
              </div>
            )}
        </Col>
      </Row>
      {/* </div> */}
    </form>
  );
};

export default ComDropDown;
