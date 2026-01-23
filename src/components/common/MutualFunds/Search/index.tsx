import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import { Input } from "@mui/material";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

interface MfSearchProps {
  searchModal: boolean;
  setSearchModal: (value: boolean) => void;
  setSelectedMutualFund: (value: any) => void;
}

const MfSearch = ({
  searchModal,
  setSearchModal,
  setSelectedMutualFund,
}: MfSearchProps) => {
  const [searchKey, setSearchKey] = useState("");
  const [fundOverviewData, setFundOverviewData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const toggle = () => {
    setSearchModal(!searchModal);
    setSearchKey("");
    setFundOverviewData([]);
  };

  useEffect(() => {
    if (!searchKey.trim()) {
      setFundOverviewData([]);
      return;
    }

    setFundOverviewData([]);

    const delayDebounce = setTimeout(async () => {
      dispatch(showLoader("Please wait, we are processing your request..."));

      try {
        const response = await apiServices.MF_FundOverView({
          pageNumber: 1,
          pageSize: 10,
          searchKey,
          schemeCode: 0,
          sipMinimum: "",
          lumpsumMinimum: "",
          riskCategory: "",
          assetClass: "",
          schemeCategory: "",
          encryptionKey: "",
        });

        setFundOverviewData(response?.data?.data || []);
      } catch (err: any) {
        console.error("Error fetching fund overview:", err.message);
      } finally {
        dispatch(hideLoader());
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchKey, dispatch]);

  return (
    <Modal isOpen={searchModal} toggle={toggle} size="lg" centered scrollable>
      <ModalHeader toggle={toggle}>Search Mutual Funds</ModalHeader>

      <ModalBody>
        {/* Search Input */}
        <Input
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
          placeholder="Search fund..."
          style={{ marginBottom: "15px", width: "100%" }}
        />

        {/* Results */}
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {fundOverviewData.length === 0 && searchKey.length > 2 && (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#888" }}
            >
              No funds found
            </div>
          )}

          {fundOverviewData.map((item: any) => (
            <div
              key={item.schemeCode}
              style={{
                display: "flex",
                gap: "10px",
                padding: "12px",
                border: "1px solid #eee",
                borderRadius: "6px",
                marginBottom: "10px",
                cursor: "pointer",
                alignItems: "center",
              }}
              onClick={() => {
                toggle();
                setSelectedMutualFund(item.schemeCode);
              }}
            >
              <img
                src={item.amcIcon}
                alt={item.schemeName}
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.schemeName}</div>
                <div style={{ fontSize: "13px", color: "#777" }}>
                  {item.amcName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MfSearch;
