/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-return-assign */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './MenuLeft.less';

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
      dataUser: {},
      loaded: false,
    };
  }

  componentDidMount() {
    const { authentication } = this.props;
    this.setState(
      {
        dataUser: authentication.getonlyuser,
      },
      () => {
        const { dataUser } = this.state;
        const imgLoader = new Image();
        imgLoader.src = `/images/ft/${dataUser.avatar}`;
        imgLoader.onload = () => {
          if (this.imgElm && dataUser.avatar) {
            this.imgElm.style.backgroundImage = `url(/images/ft/${dataUser.avatar})`;
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
          imgLoader.src = `/images/ft/${dataUser.avatar}`;
          imgLoader.onload = () => {
            if (this.imgElm && dataUser.avatar) {
              this.imgElm.style.backgroundImage = `url(/images/ft/${dataUser.avatar})`;
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
    return (
      <div className={styles.profile}>
        <div className={styles.container}>
          <div className={styles.main}>
            <div className={styles['detail-left']}>
              <div className={styles['avatar-cart']}>
                <div
                  ref={imgElm => (this.imgElm = imgElm)}
                  className={styles['background-avatar']}
                  style={{
                    backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAGAAQMAAABMQ5IQAAAAA1BMVEX///+nxBvIAAAANklEQVR42u3BAQEAAACCoP6vbojAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC8A4EAAAFVQt90AAAAAElFTkSuQmCC)`,
                    backgroundColor: this.state.loaded ? 'none' : 'rgb(242, 242, 242)',
                  }}
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
