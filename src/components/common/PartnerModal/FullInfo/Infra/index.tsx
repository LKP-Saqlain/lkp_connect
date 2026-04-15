import { Box } from "@mui/material";
import { SectionTitle, FieldGrid } from "../../StylingCss";

const Infra = ({ data }: { data: any }) => {
  if (!data) return null;

  const mappedData = {
    noOfOffices: data.noOfoffices,
    noOfTerminals: data.noOfTerminals,
    sqFeetArea: data.sqFeetArea,
    noOfPc: data.noOfPc,
  };

  return (
    <Box>
      <SectionTitle>Infrastructure Details</SectionTitle>

      <FieldGrid
        fields={[
          {
            label: "Number of Offices",
            value: mappedData.noOfOffices?.toString(),
          },
          {
            label: "No of Terminals",
            value: mappedData.noOfTerminals?.toString(),
          },
          {
            label: "Sq. feet Area",
            value: mappedData.sqFeetArea?.toString(),
          },
          {
            label: "No of PCs",
            value: mappedData.noOfPc?.toString(),
          },
        ]}
      />
    </Box>
  );
};

export default Infra;
