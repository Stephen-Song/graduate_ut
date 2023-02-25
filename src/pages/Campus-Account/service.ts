import { request } from '@umijs/max';
import { BasicListItemDataType } from './type';

type ParamsType = {
  count?: number;
} & Partial<BasicListItemDataType>;

/** 获取规则列表 GET /api/campus/fetchAccount */
export async function fetchAccountList(
  params: ParamsType,
): Promise<{ data: { list: BasicListItemDataType[] } }> {
  return request('/api/campus/fetchAccount', {
    params,
  });
}
