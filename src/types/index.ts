export interface Credentials {
  user_id: string;
  user_type: string;
}

export interface UserValues {
  credentials: Credentials;
}

export interface FormData {
  clientCode: string;
  accNo: string;
  chequeNo: string;
}

export interface MenuItems {
  menu_code: number;
  menu_name: string;
  menu_path: string | null;
  parent_menu_code: number;
  menu_order: number;
  isParent: boolean;
  subItems?: MenuItems[]; // SubItems for child menus
}
