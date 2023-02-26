import { request } from '@umijs/max';
import { UserInfoType } from './type';

/** 获取规则列表 GET /api/user/fetchInfo */
export async function fetchUserInfo(
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
    data: UserInfoType[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/user/fetchInfo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 POST /api/user/addInfo */
export async function addUserInfo(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<UserInfoType>('/api/user/addInfo', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/user/addInfo */
export async function updateUserInfo(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<UserInfoType>('/api/user/addInfo', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/user/deleteInfo */
export async function removeUserInfo(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/deleteInfo', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
