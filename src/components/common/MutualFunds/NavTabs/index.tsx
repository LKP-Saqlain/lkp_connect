import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { BasicTabsProps } from "../../../../pages/MutualFund/mfTypes";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({
  tabs = [],
  heading,
  value,
  onChange,
}: BasicTabsProps & {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        {heading && (
          <span
            style={{
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {heading}
          </span>
        )}
        <Tabs
          value={value}
          onChange={onChange}
          aria-label="tabs"
          sx={{ minHeight: "20px" }}
        >
          {tabs.length > 0 &&
            tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                {...a11yProps(index)}
                style={{ fontSize: "12px" }}
              />
            ))}
        </Tabs>
      </Box>
    </Box>
  );
}

// import * as React from "react";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Box from "@mui/material/Box";
// import {
//   BasicTabsProps,
//   TabPanelProps,
// } from "../../../pages/MutualFund/mfTypes";

// function CustomTabPanel({ children, value, index, ...other }: TabPanelProps) {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
//     </div>
//   );
// }

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// export default function BasicTabs({
//   tabs = [],
//   heading,
//   onTabChange,
// }: BasicTabsProps & { onTabChange?: (label: string) => void }) {
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setValue(newValue);

//     if (tabs[newValue]) {
//       console.log("Selected Tab:", tabs[newValue].label, event);
//       if (onTabChange) {
//         onTabChange(tabs[newValue].label);
//       }
//     }
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Box>
//         {heading && (
//           <span
//             style={{
//               fontWeight: "bold",
//               fontSize: "16px",
//             }}
//           >
//             {heading}
//           </span>
//         )}
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           aria-label="tabs"
//           sx={{ minHeight: "20px" }} // remove Tabs minHeight
//         >
//           {tabs.length > 0 &&
//             tabs.map((tab, index) => (
//               <Tab
//                 key={index}
//                 label={tab.label}
//                 {...a11yProps(index)}
//                 style={{ fontSize: "12px" }}
//                 // sx={{ minHeight: "unset", padding: "4px 8px" }} // remove Tab minHeight
//               />
//             ))}
//         </Tabs>
//       </Box>
//       {tabs.length > 0 &&
//         tabs.map((tab, index) => (
//           <CustomTabPanel key={index} value={value} index={index}>
//             {tab.content}
//           </CustomTabPanel>
//         ))}
//     </Box>
//   );
// }
