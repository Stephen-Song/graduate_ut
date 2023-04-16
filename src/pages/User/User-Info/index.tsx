import { validatePhone } from '@/utils/validate';
import { PlusOutlined } from '@ant-design/icons';
import { ProConfigProvider } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import UserForm from './components/UserForm';
import { addUserInfo, fetchUserInfo, removeUserInfo, updateUserInfo } from './service';
import { FormType, UserInfoPaginationType, UserInfoType } from './type';
/**
 * 添加用户信息
 *
 * @param fields
 */

const handleAdd = async (fields: UserInfoType) => {
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

const handleUpdate = async (fields: Partial<UserInfoType>, currentRow?: UserInfoType) => {
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

const handleRemove = async (selectedRows: UserInfoType | UserInfoType[]) => {
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
  // userForm窗口的弹窗
  const [userFormVisible, handleUserFormVisible] = useState<boolean>(false);
  // 确认删除弹窗
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<UserInfoType>();

  const columns: ProColumns<UserInfoType, 'identityEnum' | 'phone'>[] = [
    {
      title: '工编号',
      dataIndex: 'identity',
      valueType: 'identityEnum',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      title: '房屋编号',
      dataIndex: 'houseNumber',
      valueType: 'select',
      render(_, record) {
        return record.housenumber;
      },
      fieldProps: {
        placeholder: '请选择房屋编号',
        options: [
          // TODO shm 补充学院options
          {
            label: '1-101',
            value: '1-101',
          },
        ],
      },
    },
    {
      title: '学院',
      dataIndex: 'academy',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择学院',
        options: [
          // TODO shm 补充学院options
          {
            label: '计算机学院',
            value: '计算机学院',
          },
        ],
      },
    },
    {
      title: '校区',
      dataIndex: 'campus',
      valueType: 'select',
      render(_, record) {
        return record.campus;
      },
      fieldProps: {
        placeholder: '请选择校区',
        options: [
          // TODO shm 补充校区options
          {
            label: '大学城校区',
            value: '大学城校区',
          },
          {
            label: '东风路校区',
            value: '东风路校区',
          },
        ],
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      valueType: 'phone',
      fieldProps: {
        placeholder: '请输入合法的电话号码',
      },
    },
    {
      title: '入住时间',
      dataIndex: 'checkinTime',
      valueType: 'date',
      fieldProps: {
        placeholder: '请选择入住时间',
      },
    },
    {
      title: '退住时间',
      dataIndex: 'checkoutTime',
      valueType: 'date',
      fieldProps: {
        placeholder: '请选择退住时间',
      },
    },
    {
      title: '住房状态',
      dataIndex: 'status',
      hideInForm: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '已退房',
          status: 'Default',
        },
        1: {
          text: '正常缴费在住',
          status: 'Processing',
        },
        2: {
          text: '欠费状态',
          status: 'Error',
        },
      },
      fieldProps: {
        placeholder: '请选择住房状态',
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleUserFormVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setConfirmRemove(true);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <ProConfigProvider
      valueTypeMap={{
        identityEnum: {
          render(text) {
            return text;
          },
          renderFormItem(text, props) {
            const repalceText = text.replace(/[^\d]/g, '');
            return (
              <Input
                type="phone"
                placeholder="请输入工编号"
                {...props.fieldProps}
                value={repalceText}
              />
            );
          },
        },
        phone: {
          render(text) {
            return text;
          },
          renderFormItem(text, props) {
            const isError = text && validatePhone('', text);
            return (
              <Input
                {...props.fieldProps}
                type="phone"
                maxLength={11}
                status={isError ? 'error' : ''}
                placeholder="请输入合法的电话号码"
              />
            );
          },
        },
      }}
    >
      <PageContainer>
        <ProTable<UserInfoType, UserInfoPaginationType, 'identityEnum' | 'phone'>
          headerTitle="查询住户信息"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={async () => {
                const res = await fetchUserInfo({ current: 1, pageSize: 20 });
                console.log('shmres', res);
                handleUserFormVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={fetchUserInfo}
          columns={columns}
        />
        <UserForm
          visible={userFormVisible}
          onCancel={() => {
            handleUserFormVisible(false);
          }}
          formType={FormType.CREATE_FORM}
          onSubmit={async (value) => {
            const success = await handleAdd(value as UserInfoType);
            if (success) {
              handleUserFormVisible(false);
            }
          }}
        />
        <UserForm
          visible={userFormVisible}
          onCancel={() => {
            handleUserFormVisible(false);
          }}
          value={currentRow || {}}
          formType={FormType.UPDATE_FORM}
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUserFormVisible(false);
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
        {/* <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value, currentRow);

            if (success) {
              handleUserFormVisible(false);
              setCurrentRow(undefined);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUserFormVisible(false);
            setCurrentRow(undefined);
          }}
          updateModalVisible={updateModalVisible}
          values={currentRow || {}}
        /> */}
      </PageContainer>
    </ProConfigProvider>
  );
};

export default TableList;
