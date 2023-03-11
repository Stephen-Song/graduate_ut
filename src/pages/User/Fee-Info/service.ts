import { request } from '@umijs/max';
import { HouseInfoType } from './type';

/** 获取规则列表 GET /api/user/fetchInfo */
export async function fetchHouseInfo(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: HouseInfoType[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/user/fetchHouseInfo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 POST /api/user/addHouseInfo */
export async function addUserInfo(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<HouseInfoType>('/api/user/addHouseInfo', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/user/updateHouseInfo */
export async function updateUserInfo(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<HouseInfoType>('/api/user/updateHouseInfo', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/user/deleteHouseInfo */
export async function removeUserInfo(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/deleteHouseInfo', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
