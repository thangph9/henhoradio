/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div
        className={styles.container}
        style={{ backgroundImage: 'linear-gradient(-75deg, #F7B733 0%, #FC4A1A 100%)' }}
      >
        <div
          style={{
            backgroundImage: 'linear-gradient(-75deg, #F7B733 0%, #FC4A1A 100%)',
            paddingTop: '100px',
          }}
          className={styles.content}
        >
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img
                  alt="logo"
                  className={styles.logo}
                  src="https://twoo-a.akamaihd.net/static/682503600911326952191/images/logos/logo-twoo-flat-white@2x.png"
                />
              </Link>
            </div>
            <div
              className={styles.title}
              style={{ fontSize: '17px', fontWeight: 400, color: '#fff', marginTop: '20px' }}
            >
              QUÊN MẬT KHẨU?
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default UserLayout;
