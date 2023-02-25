import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Input, List, Modal, Radio, Row, Switch } from 'antd';
import type { FC } from 'react';
import React, { useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import OperationModal from './components/OperationModal';
import { fetchAccountList } from './service';
import styles from './style.less';
import type { BasicListItemDataType } from './type';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const handleSwitchChange = (checked: boolean, id: string) => {
  console.log('shm switchstatus', checked, id);
};

const ListContent = ({ data: { owner, id } }: { data: BasicListItemDataType }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem} style={{ width: '120px' }}>
      <span>校区</span>
      <p>{owner}</p>
    </div>
    <div className={styles.listContentItem} style={{ width: '150px', marginLeft: '15px' }}>
      <span>电话</span>
      <p>13444444444</p>
    </div>
    <div className={styles.listContentItem} style={{ width: '150px', marginRight: '15px' }}>
      <span>邮箱</span>
      <p>1178807588@qq.com</p>
    </div>
    <div className={styles.listContentItemBtn}>
      <Switch
        checkedChildren="权限开启"
        unCheckedChildren="权限关闭"
        defaultChecked
        onChange={(checked) => {
          handleSwitchChange(checked, id);
        }}
      />
    </div>
  </div>
);

export const BasicList: FC = () => {
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BasicListItemDataType> | undefined>(undefined);

  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(() => {
    return fetchAccountList({
      count: 50,
    });
  });
  const { run: postRun } = useRequest(
    // (method, params) => {
    (method) => {
      if (method === 'remove') {
        // return removeFakeList(params);
      }
      if (method === 'update') {
        // return updateFakeList(params);
      }
      // return addFakeList(params);
    },
    {
      manual: true,
      onSuccess: (result) => {
        mutate(result);
      },
    },
  );

  const list = listData?.list || [];

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: list.length,
  };

  const showEditModal = (item: BasicListItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    postRun('remove', { id });
  };

  const editAndDelete = (currentItem: BasicListItemDataType) => {
    Modal.confirm({
      title: '删除任务',
      content: '确定删除该任务吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(currentItem.id),
    });
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="level">
        <RadioButton value="level">按校区/等级</RadioButton>
        <RadioButton value="status">按生效状态</RadioButton>
      </RadioGroup>
      <Search
        className={styles.extraContentSearch}
        placeholder="请输入帐号姓名"
        onSearch={() => ({})}
      />
    </div>
  );

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent({});
  };

  const handleSubmit = (values: BasicListItemDataType) => {
    setDone(true);
    const method = values?.id ? 'update' : 'add';
    postRun(method, values);
  };

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={12} xs={24}>
                <Info title="已生效账号" value="8个账号" bordered />
              </Col>
              <Col sm={12} xs={24}>
                <Info title="未生效账号" value="32个账号" bordered />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="账号管理"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <a
                      key="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        editAndDelete(item);
                      }}
                    >
                      删除
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                        shape="square"
                        size="large"
                      />
                    }
                    title={<a href={item.href}>{item.title}</a>}
                    description="普通管理员"
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>
      <Button
        type="dashed"
        onClick={() => {
          setVisible(true);
        }}
        style={{ width: '100%', marginBottom: 8 }}
        size="large"
      >
        <PlusOutlined />
        添加
      </Button>
      <OperationModal
        done={done}
        visible={visible}
        current={current}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BasicList;
