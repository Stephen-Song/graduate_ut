export type TableListItem = {
  identity: string;
  name: string;
  housenumber: string;
  key: number;
  academy: string;
  phone: number;
  checkinTime: string;
  checkoutTime: string;
  status: UserStatusType;
  disabled?: boolean;
  href: string;
  avatar: string;
  owner: string;
  progress: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export enum UserStatusType {
  // 未入住
  CHECKOUT,
  // 正常缴费
  NORMAL,
  // 欠费状态
  ARRREARAGE,
}
