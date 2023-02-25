import { validateEmail, validatePhone } from '@/utils/helper';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button, Result } from 'antd';
import type { FC } from 'react';
import styles from '../style.less';
import type { BasicListItemDataType } from '../type';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  if (!visible) {
    return null;
  }
  return (
    <ModalForm<BasicListItemDataType>
      visible={visible}
      title={current ? '编辑账号信息' : '添加账号信息'}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      {!done ? (
        <>
          <ProFormText
            name="title"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名', min: 3 }]}
            placeholder="请输入姓名"
          />
          <ProFormSelect
            name="owner"
            label="校区"
            rules={[{ required: true, message: '请选择管理员所属校区' }]}
            options={[
              {
                label: '大学城校区',
                value: '大学城校区',
              },
              {
                label: '东风路校区',
                value: '东风路校区',
              },
            ]}
            placeholder="请选择管理员所属校区"
          />
          <ProFormText
            name="subDescription"
            label="电话"
            rules={[{ required: true, message: '请输入正确的电话号码', validator: validatePhone }]}
            placeholder="请输入电话号码"
          />
          <ProFormText
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入正确的邮箱', validator: validateEmail }]}
            placeholder="请输入邮箱"
          />
        </>
      ) : (
        <Result
          status="success"
          title="操作成功"
          subTitle="一系列的信息描述，很短同样也可以带标点。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      )}
    </ModalForm>
  );
};

export default OperationModal;
