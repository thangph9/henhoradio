/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-state */
/* eslint-disable default-case */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Button, Icon } from 'antd';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import { Link, Redirect } from 'react-router-dom';
import styles from './style.less';

@connect(({ about, menu }) => ({
  getabout: about.getabout,
  getmenu: menu.getmenu,
}))
// eslint-disable-next-line react/prefer-stateless-function
class About extends PureComponent {
  state = {
    number: 0,
    constNumber: 2,
  };

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ number: this.state.number + 1 }), 5000);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'about/getabout',
    });
    dispatch({
      type: 'menu/getmenu',
      payload: 'Trang đăng ký đăng nhập',
    });
  }

  componentWillReceiveProps(nextProps) {
    const getabout = this.props;
    const getmenu = this.props;
    if (getabout !== nextProps.getabout) {
      this.setState({
        about: nextProps.getabout,
        constNumber: nextProps.getabout.backgroundColor.length,
      });
    }
    if (getmenu !== nextProps.getmenu) {
      this.setState({
        menu: nextProps.getmenu,
      });
    }
  }

  image(value) {
    const { constNumber, about } = this.state;
    const result = value % constNumber;
    /*
      let result = 0;
      switch (value % constNumber) {
      case 0:
        result = 0;

        break;

      case 1:
        result = 1;
    }
    */
    return result;
  }

  background(value) {
    const { constNumber, about } = this.state;
    const kq = value % constNumber;
    const result = about.backgroundColor.find((element, index) => index === kq);
    /*
      switch (value % constNumber) {
      case 0:
        result = '#f0a1c1';

        break;

      case 1:
        result = '#21c3fd';
    }
    */
    return result;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { constNumber, number, about, menu } = this.state;

    if (localStorage.getItem('antd-pro-authority') && localStorage.getItem('token')) {
      return <Redirect to="/home" />;
    }
    if (about && menu) {
      return (
        <div style={{ height: '100%' }}>
          <div
            className={styles['splashdtf-content']}
            style={{ background: this.background(number) }}
          >
            <div className={`${styles.container} ${styles['header-item']}`}>
              <Link to="/home/newfeed" className={styles['splashdtf-logo']} />
              <div className={styles['splashdtf-header-signin']}>
                <span className={styles['splashdtf-header-signin-text']}>Have an account?</span>
                <Link to="/login?ref=0">
                  <Button style={{ border: '1px solid', background: 'none' }} type="default">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <div className={`${styles.container} ${styles['conent-item']}`}>
                <div className={styles['splashdtf-centered']}>
                  <div className={styles['splashdtf-top-text']}>
                    <h1 className={styles['splashdtf-top-text-heading']}>
                      <span>{about.title}</span>
                    </h1>
                    <h1 className={styles['mobile-title']}>
                      <span>{about.titleMobile}</span>
                    </h1>
                    <div className={styles['splashdtf-top-text-manifesto']}>
                      <p>
                        <span>{about.introduce}</span>
                      </p>
                    </div>
                    <div className={styles['mobile-content']}>
                      <p>
                        <span>{about.introduceMobile}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['splashdtf-hero']}>
                {about.backgroundImage.map((value, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundImage: `url(${value.image})`,
                      backgroundPosition: value.position,
                      backgroundSize: value.size,
                    }}
                    className={
                      this.image(number) === index
                        ? `${styles['splashdtf-hero-image']} ${`${styles.active}`}`
                        : `${styles['splashdtf-hero-image']}`
                    }
                  />
                ))}
              </div>
            </div>
            <div className={styles.container}>
              <Link className={styles['splashdtf-signup-button']} type="button" to="/login?ref=1">
                <span>Tham gia</span>
                <span className={styles['splashdtf-signup-button-logo']} />
              </Link>
            </div>
            <div className={`${styles.container} ${styles['mobile-logo']}`}>
              <Link to="/login?ref=1">
                <Button
                  block
                  size="large"
                  style={{
                    background: 'linear-gradient(-75deg,#f7b733,#fc4a1a)',
                    border: 'none',
                    borderColor: 'linear-gradient(-75deg,#f7b733,#fc4a1a)',
                    color: '#fff',
                  }}
                >
                  Tham gia hẹn hò
                </Button>
              </Link>
            </div>
            <div className={styles.container}>
              <span className={styles['terms-of-service']}>{about.guide}</span>
            </div>
            <div
              className={`${styles.container} ${styles['get-app']}`}
              style={{ paddingTop: '20px' }}
            >
              <span className={styles['splashdtf-mobile-text']}>Get the app</span>
              <a
                className={`${styles['splashdtf-mobile-buttons']} ${
                  styles['splashdtf-mobile-buttons--googleplay']
                }`}
                href="https://play.google.com/store/apps/details?id=com.okcupid.okcupid&referrer=utm_source%3Ddesktophome%2526utm_medium%253Dweb"
              >
                Google Play
              </a>
              <a
                className={`${styles['splashdtf-mobile-buttons']} ${
                  styles['splashdtf-mobile-buttons--appstore']
                }`}
                href="https://itunes.apple.com/app/apple-store/id338701294?pt=296162&ct=desktophome%20Score&mt=8"
              >
                App Store
              </a>
            </div>
            <div className={`${styles.container} ${styles['mobile-footer']}`}>
              <p>
                <span>{about.guideMobile}</span>
              </p>
            </div>
          </div>
          <div className={styles['splashdtf-footer']}>
            <div className={styles.container} style={{ color: '#000', paddingBottom: '0px' }}>
              <ul
                className={styles['splashdtf-footer-nav']}
                style={{ padding: '0px', marginBottom: '10px' }}
              >
                {menu.map((value, index) => (
                  <li key={index} className={styles['splashdtf-footer-nav-item']}>
                    <a
                      className={styles['splashdtf-footer-nav-item-link']}
                      style={{ fontWeight: 600, fontSize: '13px' }}
                      href={value.path}
                    >
                      {value.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`${styles.container} ${styles['mobile-item']}`}
              style={{ paddingBottom: '0px' }}
            >
              {about.iconFooter.map((value, index) => (
                <Icon
                  key={index}
                  type={value.type}
                  theme={value.theme}
                  style={{ fontSize: value.fontSize, marginRight: '7px', color: value.color }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
    return <PageLoading />;
  }
}
export default About;
