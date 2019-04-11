/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'react-router-dom';
import { Skeleton, Pagination } from 'antd';
import LazyImage from './LazyImage';
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
    cdn: '',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getmenu',
      payload: 'HomePage',
    });
  }

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

  handleChangePagination(v1) {
    this.props.history.push({ pathname: `/home/newfeed`, search: `?page=${v1}` });
  }

  render() {
    const { allUser, loadingPage, preLoad } = this.state;
    const {
      myprops,
      location: {
        query: { page },
      },
    } = this.props;
    if (!this.props.location.query.page) {
      return <Redirect to="/home/newfeed?page=1" />;
    }
    if (!myprops.menu_header_mobile) {
      return (
        <div style={{ paddingTop: '32px', background: '#f3f5f9' }}>
          <div className={styles.container}>
            <div className={styles.row}>
              {!loadingPage
                ? allUser
                    .filter((value, index) => index >= page * 20 - 20 && index < page * 20)
                    .map((v, i) => (
                      <Link
                        to={`/home/other-profile?id=${v.user_id.replace(/-/g, '')}`}
                        key={i}
                        className={styles['cart-item']}
                      >
                        <div className={styles['box-cart']}>
                          <LazyImage gender={v.gender} number={i % 20} avatar={v.avatar} />
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
            <Pagination
              style={{
                padding: '5px',
                display: 'table',
                margin: '0 auto',
                marginTop: '30px',
                marginBottom: '20px',
              }}
              onChange={(v1, v2) => this.handleChangePagination(v1, v2)}
              current={Number(page)}
              pageSize={20}
              total={allUser.length}
            />
          </div>
        </div>
      );
    }
    return <MenuMobile {...this.props} />;
  }
}

export default NewFeed;
