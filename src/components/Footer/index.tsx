import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '广东工业大学2019级 3119005293 宋豪铭 出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '计算机学院',
          title: '计算机学院 网络工程',
          href: '',
          blankTarget: false,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/duochizhacai',
          blankTarget: true,
        },
        {
          key: '宋豪铭',
          title: '宋豪铭',
          href: 'https://duochizhacai.github.io',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
