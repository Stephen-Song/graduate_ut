export type UserInfoType = {
  identity: string;
  name: string;
  housenumber: string;
  academy: string;
  phone: number;
  checkinTime: string;
  checkoutTime: string;
  status: UserStatusType;
};

export type UserInfoPaginationType = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: UserInfoType[];
  pagination: Partial<UserInfoPaginationType>;
};

export enum UserStatusType {
  // 未入住
  CHECKOUT,
  // 正常缴费
  NORMAL,
  // 欠费状态
  ARRREARAGE,
}

export enum FormType {
  CREATE_FORM = 'create_form',
  UPDATE_FORM = 'update_form',
}
