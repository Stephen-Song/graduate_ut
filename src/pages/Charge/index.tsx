import { ProForm, ProFormGroup, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message, Typography } from 'antd';
import { useEffect, useState } from 'react';
import './style.less';
import { ChargeItem } from './type';

const { Title } = Typography;

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const [houseNumber, setHouseNumber] = useState<string | undefined>();
  const [chargeList, setChargeList] = useState<ChargeItem[]>([
    { chargeItem: '水费', chargeCount: 4, chargePrice: 2.5 },
    { chargeItem: '电费', chargeCount: 5, chargePrice: 5 },
  ]);

  useEffect(() => {
    if (!houseNumber) {
      return;
    }

    // TODO: shm 补充根据housenumber请求收费项目
    setChargeList([
      { chargeItem: '水费', chargeCount: 4, chargePrice: 2.5 },
      { chargeItem: '电费', chargeCount: 5, chargePrice: 5 },
    ]);
  }, [houseNumber]);
  return (
    <>
      <Title level={4}>收费</Title>
      <ProForm
        layout="vertical"
        grid={true}
        onFinish={async (values) => {
          await waitTime(2000);
          console.log(values);
          message.success('提交成功');
        }}
        params={{}}
        className="charge_form"
        submitter={{
          searchConfig: {
            submitText: '提交收费',
            resetText: '重置',
          },
        }}
      >
        <ProFormGroup title="房屋信息">
          <ProFormSelect
            width="md"
            fieldProps={{
              labelInValue: true,
              onChange(value) {
                setHouseNumber(value);
              },
            }}
            request={async () => [
              { label: '全部', value: 'all' },
              { label: '未解决', value: 'open' },
              { label: '已解决', value: 'closed' },
              { label: '解决中', value: 'processing' },
            ]}
            name="houseNumber"
            label="房屋编号"
            placeholder="请选择房屋编号"
            colProps={{ md: 6, xl: 6, lg: 6, xxl: 6 }}
          />
          <ProFormText
            name="identify"
            label="工编号"
            placeholder="请选择房屋编号以匹配工编号"
            colProps={{ md: 6, xl: 6, lg: 6, xxl: 6 }}
            width="md"
            disabled
          />
          <ProFormText
            name="name"
            label="姓名"
            placeholder="请选择房屋编号以匹配姓名"
            colProps={{ md: 6, xl: 6, lg: 6, xxl: 6 }}
            width="md"
            disabled
          />
          <ProFormText
            name="phone"
            label="电话"
            placeholder="请选择房屋编号以匹配手机号码"
            colProps={{ md: 6, xl: 6, lg: 6, xxl: 6 }}
            width="md"
            disabled
          />
        </ProFormGroup>

        <ProFormGroup title="收费信息">
          {chargeList.map((chargeItem) => (
            <>
              <ProFormText
                name="phone"
                label="收费项目"
                fieldProps={{
                  value: chargeItem.chargeItem,
                }}
                colProps={{ md: 8, xl: 8, lg: 8, xxl: 8 }}
                width="md"
                disabled
              />
              <ProFormText
                name="phone"
                label="收费单价"
                fieldProps={{
                  value: chargeItem.chargePrice,
                }}
                colProps={{ md: 8, xl: 8, lg: 8, xxl: 8 }}
                width="md"
                disabled
              />
              <ProFormText
                name="phone"
                label="收费数量"
                fieldProps={{
                  value: chargeItem.chargeCount,
                }}
                colProps={{ md: 8, xl: 8, lg: 8, xxl: 8 }}
                width="md"
                disabled
              />
            </>
          ))}
        </ProFormGroup>
      </ProForm>
    </>
  );
};
