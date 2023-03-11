import { UserStatusType } from '../User-Info/type';

export type HouseInfoType = {
  housenumber: string;
  houseType: HouseType;
  campus: string;
  address: string;
  status: UserStatusType;
};

export type UserInfoPaginationType = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: HouseInfoType[];
  pagination: Partial<UserInfoPaginationType>;
};

export enum HouseType {
  // 民用
  CIVILAL,
  // 商用
  COMMERCIAL,
}

export enum FormType {
  CREATE_FORM = 'create_form',
  UPDATE_FORM = 'update_form',
}
