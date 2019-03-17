/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { MenuMobile } from '@/components/GlobalHeader';
import styles from './index.less';

@connect(({ list, user, authentication, myprops }) => ({
  list,
  user,
  authentication,
  myprops,
}))
class NewFeed extends PureComponent {
  state = {
    allUser: [],
    loadingPage: true,
    preLoad: [1, 2, 3, 4, 5, 6, 7, 8],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authentication/getallusers',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;
    if (authentication.getallusers !== nextProps.authentication.getallusers) {
      this.setState({
        allUser: nextProps.authentication.getallusers,
        loadingPage: false,
      });
    }
  }

  render() {
    const { allUser, loadingPage, preLoad } = this.state;
    const { myprops } = this.props;
    if (!myprops.menu_header_mobile) {
      return (
        <div style={{ paddingTop: '32px', background: '#f3f5f9' }}>
          <div className={styles.container}>
            <div className={styles.row}>
              {!loadingPage
                ? allUser.map((v, i) => (
                    <Link
                      to={`/home/other-profile?id=${v.user_id.replace(/-/g, '')}`}
                      key={i}
                      className={styles['cart-item']}
                    >
                      <div className={styles['box-cart']}>
                        <div style={{ overflow: 'hidden' }}>
                          <div
                            className={styles['background-avatar']}
                            style={
                              v.avatar
                                ? { backgroundImage: `url(/images/ft/${v.avatar})` }
                                : {
                                    backgroundImage: `url(https://mcgillmbajapan.com/wp-content/themes/mcgill/img/anonymous-avatar.png)`,
                                  }
                            }
                          />
                        </div>
                        <div className={styles['title-cart']}>
                          <span className={styles.detail}>{v.fullname}</span>
                          <span className={styles.detail}>,</span>
                          <span className={styles.detail}>{v.age}</span>
                          <span className={styles.detail}>{v.address}</span>
                        </div>
                      </div>
                    </Link>
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
    return <MenuMobile {...this.props} />;
  }
}

export default NewFeed;
