import { createContext, useContext } from "react";

type Vendor = {
  rowId: number;
  vendorName: string;
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
  return (
    <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
  );
};
