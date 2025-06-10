export const SubItemKeys = {
  REFERAL_ENTRY_STATUS: "Referal Entry Status",
  REFERAL_ENTRY: "Referal Entry",
  REFERAL_LEAD: "Referal Lead",
} as const;

export type SubItemKey = (typeof SubItemKeys)[keyof typeof SubItemKeys];
