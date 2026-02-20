import { Box } from "@mui/material";
import Nominee from "../../../../../../pages/MutualFund/Main/PhysicalOnboard/Nominee";

interface Props {
  data: Record<string, any>;
  onChange: (payload: { field: string; value: any }) => void;
  onSaveStatus: (index: number, valid: boolean) => void;
}

const TOTAL_NOMINEES = 3;

const NomineeSection = ({ data, onChange, onSaveStatus }: Props) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(3, 1fr)", // ✅ 3 columns
        },
        gap: 2,
      }}
    >
      {Array.from({ length: TOTAL_NOMINEES }).map((_, idx) => {
        const nomineeIndex = idx + 1;

        return (
          <Nominee
            key={nomineeIndex}
            index={nomineeIndex}
            data={data}
            onChange={onChange}
            onSaveStatus={onSaveStatus}
          />
        );
      })}
    </Box>
  );
};

export default NomineeSection;
