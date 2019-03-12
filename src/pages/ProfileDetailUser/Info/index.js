/* eslint-disable camelcase */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
/* eslint-disable dot-notation */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Icon, Input, Button, Skeleton, Radio, Checkbox, message, Tooltip } from 'antd';
import styles from './MenuLeft.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@connect(({ profile, loading, authentication, myprops }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
  authentication,
  myprops,
}))
class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMainRight: 0,
    };
  }

  handleClickItemMenu(v) {
    if (v === 0) {
      this.props.history.push({ pathname: '/home/profile-user/information' });
    } else if (v === 1) {
      this.props.history.push({ pathname: '/home/profile-user/setting-security' });
    } else if (v === 2) {
      this.props.history.push({ pathname: '/home/profile-user/answer-question' });
    }
  }

  render() {
    const { menu_item_profile } = this.props.myprops;
    const { currentMainRight } = this.state;
    const { children } = this.props;
    return (
      <div className={styles['profile']}>
        <div className={styles['container']}>
          <div className={styles['main']}>
            <div className={styles['detail-left']}>
              <div className={styles['avatar-cart']}>
                <img
                  className={styles['img-avatar']}
                  alt="img"
                  src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                />
              </div>
              <div className={styles['menu']}>
                <div
                  onClick={() => this.handleClickItemMenu(0)}
                  className={
                    menu_item_profile === 0
                      ? `${styles['menu-item-left']} ${styles['active']}`
                      : styles['menu-item-left']
                  }
                >
                  Thông tin cá nhân
                </div>
                <div
                  onClick={() => this.handleClickItemMenu(1)}
                  className={
                    menu_item_profile === 1
                      ? `${styles['menu-item-left']} ${styles['active']}`
                      : styles['menu-item-left']
                  }
                >
                  Cài đặt bảo mật
                </div>
                <div
                  onClick={() => this.handleClickItemMenu(2)}
                  className={
                    menu_item_profile === 2
                      ? `${styles['menu-item-left']} ${styles['active']}`
                      : styles['menu-item-left']
                  }
                >
                  Hỏi đáp cá nhân
                </div>
              </div>
            </div>
            <div className={styles['detail-right']}>{children}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Info;
