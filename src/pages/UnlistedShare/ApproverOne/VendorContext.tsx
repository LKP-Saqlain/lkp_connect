import { createContext, useContext } from "react";

type Vendor = {
  rid: number;
  vn: string;
};

const VendorContext = createContext<Vendor[]>([]);

export const useVendors = () => useContext(VendorContext);

export const VendorProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Vendor[];
}) => {
  console.log("valueeee", value);

  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
};
