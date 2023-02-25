import { PlusOutlined } from '@ant-design/icons';
import { ProConfigProvider } from '@ant-design/pro-components';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { addRule, removeRule, rule, updateRule } from './service';
import type { TableListItem, TableListPagination } from './type';
/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
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
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
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
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
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
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem, 'identityEnum'>[] = [
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
      fieldProps: {
        options: [
          {
            label: '123',
            value: 'abc',
          },
        ],
      },
    },
    {
      title: '学院',
      dataIndex: 'academy',
      valueType: 'select',
      valueEnum: {
        '0': {
          text: '计算机学院',
          status: 'default',
        },
        '1': {
          text: '体育部',
          status: 'error',
        },
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      // valueType(entity, type) {

      // },
    },
    {
      title: '入住时间',
      // sorter: true,
      dataIndex: 'checkinTime',
      // dataIndex: 'updatedAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: '退住时间',
      dataIndex: 'checkoutTime',
      valueType: 'dateTime',
    },
    {
      title: '住房状态',
      dataIndex: 'status',
      hideInForm: true,
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
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            console.log('shm click删除');
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
          renderFormItem(text, props) {
            const repalceText = text.replace(/[^\d]/g, '');
            return (
              <Input
                type="digital"
                placeholder="请输入工编号"
                {...props.fieldProps}
                value={repalceText}
              />
            );
          },
        },
      }}
    >
      <PageContainer>
        <ProTable<TableListItem, TableListPagination>
          headerTitle="查询住户信息"
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
                handleModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={rule}
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
                <span>
                  服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                  万
                </span>
              </div>
            }
          >
            <Button
              onClick={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              批量删除
            </Button>
            <Button type="primary">批量审批</Button>
          </FooterToolbar>
        )}
        <ModalForm
          title="新建规则"
          width="400px"
          visible={createModalVisible}
          onVisibleChange={handleModalVisible}
          onFinish={async (value) => {
            const success = await handleAdd(value as TableListItem);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: '规则名称为必填项',
              },
            ]}
            width="md"
            name="name"
          />
          <ProFormTextArea width="md" name="desc" />
        </ModalForm>
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value, currentRow);

            if (success) {
              handleUpdateModalVisible(false);
              setCurrentRow(undefined);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
          }}
          updateModalVisible={updateModalVisible}
          values={currentRow || {}}
        />
      </PageContainer>
    </ProConfigProvider>
  );
};

export default TableList;
