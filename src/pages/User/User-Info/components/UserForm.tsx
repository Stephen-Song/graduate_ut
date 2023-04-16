import { validatePhone } from '@/utils/validate';
import {
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import moment from 'moment';
import React from 'react';
import { FormType, UserInfoType } from '../type';

// type CreateFormCommonProps = {
//   visible: boolean;
//   onCancel: () => void;
//   onSubmit: (value: UserInfoType) => Promise<void>;
// };

// interface FormPropsType<T extends FormType> extends CreateFormCommonProps {
//   formType: T;
//   value: T extends FormType.UPDATE_FORM ? Partial<UserInfoType> : never
// }

interface FormPropsType {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (value: UserInfoType) => Promise<void>;
  formType: FormType;
  value?: Partial<UserInfoType>;
}

const onIdentityChange = (name: any) => {
  console.log('shm formchange', typeof name.target.value);
  // TODO shm 待补充根据工编号获取姓名
};

const UserForm: React.FC<FormPropsType> = (props) => {
  const { visible, onCancel, onSubmit, formType, value } = props;
  const isCreateForm = formType === FormType.CREATE_FORM;
  return (
    <StepsForm
      stepsProps={{
        size: 'default',
        direction: 'vertical',
      }}
      onFinish={onSubmit}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            title={isCreateForm ? '新建用户' : '编辑用户'}
            width={800}
            onCancel={onCancel}
            open={visible}
            footer={submitter}
            destroyOnClose
          >
            {dom}
          </Modal>
        );
      }}
    >
      <StepsForm.StepForm
        layout="vertical"
        initialValues={
          isCreateForm
            ? { identity: '', academy: '', phone: '' }
            : {
                identity: value?.identity,
                academy: value?.academy,
                phone: value?.phone,
              }
        }
        title="基本信息"
      >
        <ProFormText
          fieldProps={{
            onChange: onIdentityChange,
            placeholder: '请输入工编号',
          }}
          name="identity"
          label="工编号"
          width="md"
          rules={[
            {
              required: true,
              validator(_rule, value, callback) {
                if (isNaN(+value)) {
                  callback('请输入正确的工编号');
                } else {
                  callback();
                }
              },
            },
          ]}
        />
        <ProFormText
          width="md"
          name="name"
          label="姓名"
          fieldProps={{ value: '123', placeholder: '请输入工编号以自动识别姓名' }}
          disabled={true}
        />
        <ProFormSelect
          width="md"
          name="academy"
          label="学院"
          fieldProps={{
            placeholder: '请选择学院',
            options: [
              // TODO shm 补充学院options
              {
                label: '计算机学院',
                value: '计算机学院',
              },
            ],
          }}
          rules={[
            {
              required: true,
              message: '请选择学院',
            },
          ]}
        />
        <ProFormText
          name="phone"
          label="电话"
          width="md"
          rules={[
            {
              required: true,
              validator: validatePhone as () => void,
            },
          ]}
          fieldProps={{
            placeholder: '请输入11位有效的电话号码',
          }}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={
          isCreateForm
            ? {
                houseNumber: '',
                checkinTime: moment(new Date()).format('YYYY-MM-DD'),
                checkoutTime: undefined,
              }
            : {
                houseNumber: value?.housenumber,
                checkinTime: value?.checkinTime,
                checkoutTime: value?.checkoutTime,
              }
        }
        title="房屋相关信息"
      >
        <ProFormSelect
          name="houseNumber"
          width="md"
          label="房屋编号"
          rules={[
            {
              required: true,
              message: '请选择房屋编号',
            },
          ]}
          fieldProps={{
            placeholder: '请选择房屋编号',
            options: [
              // TODO shm 补充房屋编号options
              {
                label: '123',
                value: 'abc',
              },
            ],
          }}
        />
        <ProFormDatePicker
          name="checkinTime"
          width="md"
          label="入住时间"
          fieldProps={{
            placeholder: '请选择入住时间',
          }}
          rules={[
            {
              required: true,
              message: '请选择房屋编号',
            },
          ]}
        />
        <ProFormDatePicker
          fieldProps={{
            placeholder: '请选择退住时间',
          }}
          name="checkoutTime"
          width="md"
          label="退住时间"
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UserForm;
