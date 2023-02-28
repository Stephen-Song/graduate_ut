import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import FormList from 'antd/es/form/FormList';
import React from 'react';
import { FormType, HouseInfoType } from '../type';
import './style.less';

interface FormPropsType {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (value: HouseInfoType) => Promise<boolean | void>;
  formType: FormType;
  value?: Partial<HouseInfoType>;
}

const UserForm: React.FC<FormPropsType> = (props) => {
  const { visible, onCancel, onSubmit, formType, value } = props;
  const isCreateForm = formType === FormType.CREATE_FORM;
  return (
    <StepsForm
      stepsProps={{
        size: 'default',
      }}
      onFinish={onSubmit}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            title={isCreateForm ? '新建用户' : '编辑用户'}
            width={1000}
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
        initialValues={
          isCreateForm
            ? { houseNumber: '', houseType: '', address: '' }
            : {
                identity: value?.housenumber,
                academy: value?.houseType,
                phone: value?.address,
              }
        }
        title="房屋基本信息"
      >
        <ProFormText
          fieldProps={{
            placeholder: '请输入房屋编号',
          }}
          name="houseNumber"
          label="房屋编号"
          width="md"
          rules={[
            {
              required: true,
              message: '请输入房屋编号',
            },
          ]}
        />
        <ProFormSelect
          width="md"
          name="houseType"
          label="房屋类型"
          rules={[
            {
              required: true,
              message: '请选择房屋类型',
            },
          ]}
          fieldProps={{
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
          }}
        />
        <ProFormTextArea
          width="md"
          name="address"
          label="地址"
          allowClear
          fieldProps={{
            maxLength: 100,
            showCount: true,
            autoSize: true,
            placeholder: '请输入地址',
          }}
          rules={[
            {
              required: true,
              message: '请输入地址',
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        layout="inline"
        initialValues={{
          chargeItem: '',
          chargePrice: '',
        }}
        title="房屋收费信息"
      >
        <ProFormText
          name="chargeItem"
          width="md"
          label="收费项目"
          rules={[
            {
              required: true,
              message: '请输入收费项目',
            },
          ]}
          fieldProps={{
            placeholder: '请输入收费项目',
          }}
        />
        <ProFormText
          name="chargePrice"
          width="md"
          label="收费单价"
          rules={[
            {
              required: true,
              validator(_, value, callback) {
                if (isNaN(value)) {
                  callback('请输入正确的收费单价');
                } else {
                  callback();
                }
              },
            },
          ]}
          fieldProps={{
            placeholder: '请输入收费单价',
          }}
        />
        <FormList name="additionalAdd">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <ProFormGroup key="group" style={{ marginTop: '20px' }}>
                  <ProFormText
                    name={[field.name, 'chargeItem']}
                    width="md"
                    label="收费项目"
                    rules={[
                      {
                        required: true,
                        message: '请输入收费项目',
                      },
                    ]}
                    fieldProps={{
                      placeholder: '请输入收费项目',
                    }}
                  />
                  <ProFormText
                    name={[field.name, 'chargePrice']}
                    width="md"
                    label="收费单价"
                    rules={[
                      {
                        required: true,
                        validator(_, value, callback) {
                          if (isNaN(value)) {
                            callback('请输入正确的收费单价');
                          } else {
                            callback();
                          }
                        },
                      },
                    ]}
                    fieldProps={{
                      placeholder: '请输入收费单价',
                    }}
                  />
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </ProFormGroup>
              ))}
              <ProForm.Item style={{ marginTop: '15px' }}>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                    console.log('shm click');
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  新增一行
                </Button>
              </ProForm.Item>
            </>
          )}
        </FormList>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UserForm;
