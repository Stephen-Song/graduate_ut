import { validatePhone } from '@/utils/validate';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ProConfigProvider } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Input, message, Modal, Popover, Progress, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import UserForm from './components/HouseForm';
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
  const [selectedRowsState, setSelectedRows] = useState<HouseInfoType[]>([]);

  const columns: ProColumns<HouseInfoType, 'identityEnum' | 'phone'>[] = [
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
          // TODO shm 补充房屋编号options
          {
            label: '1-101',
            value: '1-101',
          },
        ],
      },
    },
    {
      title: '房屋类型',
      dataIndex: 'houseType',
      valueType: 'select',
      render(_, record) {
        return record.houseType ? '商用' : '民用';
      },
      fieldProps: {
        placeholder: '请选择房屋类型',
        options: [
          // TODO shm 补充房屋类型options
          {
            label: '住房',
            value: '住房',
          },
          {
            label: '商用',
            value: '商用',
          },
        ],
      },
    },
    {
      title: '校区',
      dataIndex: 'campus',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择校区',
        options: [
          { label: '计算机学院', value: '计算机学院' },
          { label: '外国语学院', value: '外国语学院' },
        ],
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      valueType: 'text',
      hideInSearch: true,
      width: '400px',
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
        <Popover
          content={
            <div>
              <a style={{ marginRight: '5px' }}>水费单价</a>
              <a>20元</a>
              <Progress
                width={30}
                style={{ marginRight: '5px' }}
                percent={60}
                status="exception"
                format={(percent) => {
                  return percent ? `${2 * +percent - 100}%` : `0%`;
                }}
              />
              <a style={{ marginRight: '5px' }}>电费单价</a>
              <a>20元</a>
              <Progress
                width={30}
                style={{ marginRight: '5px' }}
                percent={60}
                status="exception"
                format={(percent) => {
                  return percent ? `${2 * +percent - 100}%` : `0%`;
                }}
              />
              <a style={{ marginRight: '5px' }}>物业费单价</a>
              <a>20元</a>
              <Progress
                width={30}
                style={{ marginRight: '5px' }}
                percent={60}
                status="exception"
                format={(percent) => {
                  return percent ? `${2 * +percent - 100}%` : `0%`;
                }}
              />
            </div>
          }
          title={
            <div>
              计费信息详情
              <Tooltip title="进度条表示与标准(民用/商用)费用相差的百分比">
                <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
              </Tooltip>
            </div>
          }
          key="feePopover"
        >
          <Button type="primary" key="fee">
            计费信息
          </Button>
        </Popover>,
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
            console.log('shm identity', repalceText);
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
            console.log('shm phone', text);
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
        <ProTable<HouseInfoType, UserInfoPaginationType, 'identityEnum' | 'phone'>
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
          rowSelection={{
            onChange: (_, selectedRows) => {
              console.log('shm onChange');
              setSelectedRows(selectedRows);
            },
          }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                已选择{' '}
                <a
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {selectedRowsState.length}
                </a>{' '}
                项 &nbsp;&nbsp;
              </div>
            }
          >
            <Button
              onClick={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
              type="primary"
            >
              批量删除
            </Button>
          </FooterToolbar>
        )}
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
