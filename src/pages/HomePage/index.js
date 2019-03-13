/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable vars-on-top */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/button-has-type */
/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable no-useless-escape */
/* eslint-disable one-var */
/* eslint-disable prefer-template */
/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Skeleton, Switch, List, Avatar, Icon, Card } from 'antd';
import { MenuMobile } from '@/components/GlobalHeader';
import styles from './index.less';

const listData = [];
for (let i = 0; i < 3; i++) {
  listData.push({
    href: 'http://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}
const { Meta } = Card;
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
@connect(({ list, user, authentication, myprops, loading }) => ({
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
    this.props.dispatch({
      type: 'authentication/getallusers',
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.getallusers !== nextProps.authentication.getallusers) {
      if (nextProps.authentication.getallusers.status === 'ok') {
        this.setState({
          allUser: nextProps.authentication.getallusers.data,
          loadingPage: false,
        });
      }
    }
  }
  render() {
    const { allUser, loadingPage, preLoad } = this.state;
    if (!this.props.myprops.menu_header_mobile) {
      return (
        <div style={{ paddingTop: '32px', background: '#f3f5f9' }}>
          <div className={styles['container']}>
            <div className={styles['row']}>
              {!loadingPage
                ? allUser.map((v, i) => {
                    return (
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
                            <span className={styles['detail']}>{v.fullname}</span>
                            <span className={styles['detail']}>,</span>
                            <span className={styles['detail']}>{v.age}</span>
                            <span className={styles['detail']}>{v.address}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                : preLoad.map((v, i) => {
                    return (
                      <div key={i} className={styles['cart-item']}>
                        <div className={styles['image-cart']}>
                          <span>
                            <img
                              className={styles['img-item']}
                              style={{ width: '100%' }}
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRfrBguCWgYZbzZNuUieTET8xYdUatKh5t1emOHuR3Cjzihd82"
                              alt="img"
                            />
                          </span>
                        </div>
                        <div style={{ background: '#fff' }}>
                          <Skeleton paragraph={{ rows: 1 }} active />
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      );
    }
    return <MenuMobile {...this.props} />;
  }
}

export default NewFeed;
