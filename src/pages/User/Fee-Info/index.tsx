import { PlusOutlined } from '@ant-design/icons';
import { ProConfigProvider } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import UserForm from './components/FeeForm';
import { addUserInfo, fetchHouseInfo, removeUserInfo, updateUserInfo } from './service';
import { FormType, HouseInfoType, UserInfoPaginationType } from './type';
/**
 * 添加用户信息
 *
 * @param fields
 */

const handleAdd = async (fields: HouseInfoType) => {
  console.log('shm fields', fields);
  const hide = message.loading('正在添加');

  try {
    await addUserInfo({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新用户信息
 *
 * @param fields
 */

const handleUpdate = async (fields: Partial<HouseInfoType>, currentRow?: HouseInfoType) => {
  const hide = message.loading('正在更新');

  try {
    await updateUserInfo({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除用户信息
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: HouseInfoType | HouseInfoType[]) => {
  const selected = Array.isArray(selectedRows) ? selectedRows : [selectedRows];
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeUserInfo({
      key: selected.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  // houseInfoForm新建窗口的弹窗
  const [houseAddVisible, handleHouseAddVisible] = useState<boolean>(false);
  const [houseUpdateVisible, handleHouseUpdateVisible] = useState<boolean>(false);
  // 确认删除弹窗
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<HouseInfoType>();

  const columns: ProColumns<HouseInfoType, 'fitCampus'>[] = [
    {
      title: '收费项目',
      dataIndex: 'chargeItem',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入收费项目',
      },
    },
    {
      title: '单位',
      dataIndex: 'unit',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入单位',
      },
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入单价',
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enable',
      valueType: 'radioButton',
      hideInSearch: true,
    },
    {
      title: '适用校区',
      dataIndex: 'fitCampus',
      valueType: 'fitCampus',
      width: '300px',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: '250px',
      render: (_, record) => [
        <Button
          type="default"
          key="edit"
          onClick={() => {
            handleHouseUpdateVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </Button>,
        <Button
          type="primary"
          danger
          key="delete"
          onClick={() => {
            setConfirmRemove(true);
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <ProConfigProvider
      valueTypeMap={{
        fitCampus: {
          renderFormItem(text, _props) {
            return (
              <>
                {text
                  ? text.map((item: any) => (
                      <Switch disabled={false} defaultChecked={item.check} key={item} />
                    ))
                  : null}
              </>
            );
          },
        },
      }}
    >
      <PageContainer>
        <ProTable<HouseInfoType, UserInfoPaginationType, 'fitCampus'>
          headerTitle="查询房屋信息"
          actionRef={actionRef}
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleHouseAddVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={fetchHouseInfo}
          columns={columns}
        />

        <UserForm
          visible={houseAddVisible}
          onCancel={() => {
            handleHouseAddVisible(false);
          }}
          formType={FormType.CREATE_FORM}
          onSubmit={async (value) => {
            console.log('shm housefeeadd', value);
            const success = await handleAdd(value as HouseInfoType);
            if (success) {
              handleHouseAddVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
              return true;
            }
          }}
        />
        <UserForm
          visible={houseUpdateVisible}
          onCancel={() => {
            handleHouseUpdateVisible(false);
          }}
          value={currentRow || {}}
          formType={FormType.UPDATE_FORM}
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleHouseUpdateVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
        <Modal
          open={confirmRemove}
          title="删除"
          onOk={() => {
            handleRemove(currentRow!);
          }}
          onCancel={() => {
            setConfirmRemove(false);
          }}
        >
          <b>确认是否删除该条数据吗？</b>
        </Modal>
      </PageContainer>
    </ProConfigProvider>
  );
};

export default TableList;
