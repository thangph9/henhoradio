/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Skeleton, Icon } from 'antd';
import styles from './index.less';

@connect(({ list, user, authentication, myprops }) => ({
  list,
  user,
  authentication,
  myprops,
}))
class ListRadio extends PureComponent {
  state = {
    allUser: [1, 2, 3, 4, 5, 6, 7, 8],
    loadingPage: true,
    preLoad: [1, 2, 3, 4, 5, 6, 7, 8],
  };

  componentDidMount() {}

  render() {
    const { allUser, loadingPage, preLoad } = this.state;
    return (
      <div style={{ paddingTop: '32px', background: '#f3f5f9' }}>
        <div className={styles.container}>
          <div className={styles.row}>
            {loadingPage
              ? allUser.map((v, i) => (
                  <div key={i} className={styles['cart-item']}>
                    <div className={styles['box-cart']}>
                      <div className={styles['member-information']}>
                        <li>
                          <h4>Thực hiện:</h4>
                          <h4>Nguyễn Văn A</h4>
                        </li>
                        <li>
                          <h4>Lên sóng:</h4>
                          <h4>Nguyễn Thị B </h4>
                        </li>
                        <li>
                          <h4>MC:</h4>
                          <h4>Như Ngọc</h4>
                        </li>
                        <li>
                          <h4>Thời gian lên sóng:</h4>
                          <h4>18h</h4>
                        </li>
                      </div>
                      <div className={styles['title-cart']}>
                        <div className={styles['play-icon']}>
                          <Icon type="play-circle" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : preLoad.map((v, i) => (
                  <div key={i} className={styles['cart-item']}>
                    <div className={styles['box-cart']}>
                      <div style={{ overflow: 'hidden' }}>
                        <div
                          className={styles['background-avatar']}
                          style={{ background: '#fff' }}
                        />
                      </div>
                      <div className={`${styles['title-cart']} home-page-preload`}>
                        <Skeleton title={false} paragraph={{ rows: 2 }} active />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ListRadio;
