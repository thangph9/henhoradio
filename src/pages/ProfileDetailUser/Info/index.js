/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-return-assign */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './MenuLeft.less';

@connect(({ profile, loading, authentication, myprops, user }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
  authentication,
  myprops,
  user,
}))
class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: {},
      loaded: false,
    };
  }

  componentDidMount() {
    const { authentication, user } = this.props;
    this.setState(
      {
        dataUser: authentication.getonlyuser,
      },
      () => {
        const { dataUser } = this.state;
        const imgLoader = new Image();
        imgLoader.src = `${user.getsetting.cdn}${dataUser.avatar}`;
        imgLoader.onload = () => {
          if (this.imgElm && dataUser.avatar) {
            this.imgElm.style.backgroundImage = `url(${user.getsetting.cdn}${dataUser.avatar})`;
            this.setState({
              loaded: true,
            });
          }
        };
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;
    if (authentication.getonlyuser !== nextProps.authentication.getonlyuser) {
      this.setState(
        {
          dataUser: nextProps.authentication.getonlyuser,
        },
        () => {
          const { dataUser } = this.state;
          const imgLoader = new Image();
          imgLoader.src = `${nextProps.user.getsetting.cdn}${dataUser.avatar}`;
          imgLoader.onload = () => {
            if (this.imgElm && dataUser.avatar) {
              this.imgElm.style.backgroundImage = `url(${nextProps.user.getsetting.cdn}${
                dataUser.avatar
              })`;
              this.setState({
                loaded: true,
              });
            }
          };
        }
      );
    }
  }

  handleClickItemMenu(v) {
    const { history } = this.props;
    if (v === 0) {
      history.push({ pathname: '/home/profile-user/information' });
    } else if (v === 1) {
      history.push({ pathname: '/home/profile-user/setting-security' });
    } else if (v === 2) {
      history.push({ pathname: '/home/profile-user/answer-question' });
    }
  }

  render() {
    const {
      myprops: { menu_item_profile },
    } = this.props;
    const { children } = this.props;
    const { dataUser } = this.state;
    return (
      <div className={styles.profile}>
        <div className={styles.container}>
          <div className={styles.main}>
            <div className={styles['detail-left']}>
              <div className={styles['avatar-cart']}>
                <div
                  ref={imgElm => (this.imgElm = imgElm)}
                  className={styles['background-avatar']}
                  style={
                    dataUser
                      ? {
                          backgroundImage:
                            dataUser.gender === 'male'
                              ? `url(https://twoo01-a.akamaihd.net/static/1636596845823273814/images/generic/avatar-male.jpg)`
                              : dataUser.gender === 'female' &&
                                `url(https://twoo01-a.akamaihd.net/static/1636596845823273814/images/generic/avatar-female.jpg)`,
                          backgroundColor: this.state.loaded ? 'none' : 'rgb(242, 242, 242)',
                        }
                      : { background: '#f2f2f2' }
                  }
                />
              </div>
              <div className={styles.menu}>
                <div
                  onClick={() => this.handleClickItemMenu(0)}
                  className={
                    menu_item_profile === 0
                      ? `${styles['menu-item-left']} ${styles.active}`
                      : styles['menu-item-left']
                  }
                >
                  Thông tin cá nhân
                </div>
                <div
                  onClick={() => this.handleClickItemMenu(1)}
                  className={
                    menu_item_profile === 1
                      ? `${styles['menu-item-left']} ${styles.active}`
                      : styles['menu-item-left']
                  }
                >
                  Cài đặt bảo mật
                </div>
                <div
                  onClick={() => this.handleClickItemMenu(2)}
                  className={
                    menu_item_profile === 2
                      ? `${styles['menu-item-left']} ${styles.active}`
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
