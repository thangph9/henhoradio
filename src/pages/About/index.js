/* eslint-disable default-case */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Button, Icon } from 'antd';
import styles from './style.less';

// eslint-disable-next-line react/prefer-stateless-function
class About extends PureComponent {
  state = {
    number: 0,
    constNumber: 2,
  };

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ number: this.state.number + 1 }), 3000);
  }

  image(value) {
    const { constNumber } = this.state;
    let result = 0;
    switch (value % constNumber) {
      case 0:
        result = 0;

        break;

      case 1:
        result = 1;
    }
    return result;
  }

  background(value) {
    const { constNumber } = this.state;
    let result = {};
    switch (value % constNumber) {
      case 0:
        result = '#f0a1c1';

        break;

      case 1:
        result = '#21c3fd';
    }
    return result;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { constNumber, number } = this.state;
    const backgroundColor = this.background(number);
    return (
      <div style={{ paddingBottom: '30px' }}>
        <div className={styles['splashdtf-content']} style={{ background: backgroundColor }}>
          <div className={`${styles.container} ${styles['header-item']}`}>
            <div className={styles['splashdtf-logo']} />
            <div className={styles['splashdtf-header-signin']}>
              <span className={styles['splashdtf-header-signin-text']}>Have an account?</span>
              <Button style={{ border: '1px solid', background: 'none' }} type="default">
                Đăng nhập
              </Button>
            </div>
          </div>
          <div>
            <div className={`${styles.container} ${styles['conent-item']}`}>
              <div className={styles['splashdtf-centered']}>
                <div className={styles['splashdtf-top-text']}>
                  <h1 className={styles['splashdtf-top-text-heading']}>
                    <span>Dating Deserves Better</span>
                  </h1>
                  <h1 className={styles['mobile-title']}>
                    <span>{"You're"} about to go on better dates</span>
                  </h1>
                  <div className={styles['splashdtf-top-text-manifesto']}>
                    <p>
                      <span>
                        On OkCupid, you’re more than just a photo. You have stories to tell, and
                        passions to share, and things to talk about that are more interesting than
                        the weather. Get noticed for who you are, not what you look like. Because
                        you deserve what dating deserves: better.
                      </span>
                    </p>
                  </div>
                  <div className={styles['mobile-content']}>
                    <p>
                      <span>
                        We go beneath the suface to show off the real you. {"How's"} that for a
                        change?
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['splashdtf-hero']}>
              <div
                className={
                  this.image(number) === 0
                    ? `${styles['splashdtf-hero-image']} ${`${
                        styles['splashdtf-hero-image-hands']
                      } ${styles.active}`}`
                    : `${styles['splashdtf-hero-image']} ${styles['splashdtf-hero-image-hands']}`
                }
              />
              <div
                className={
                  this.image(number) === 1
                    ? `${styles['splashdtf-hero-image']} ${
                        styles['splashdtf-hero-image-facepaint']
                      } ${styles.active}`
                    : `${styles['splashdtf-hero-image']} ${
                        styles['splashdtf-hero-image-facepaint']
                      }`
                }
              />
            </div>
          </div>
          <div className={styles.container}>
            <a className={styles['splashdtf-signup-button']} type="button" href="/signup">
              <span>Tham gia</span>
              <span className={styles['splashdtf-signup-button-logo']} />
            </a>
          </div>
          <div className={`${styles.container} ${styles['mobile-logo']}`}>
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
          </div>
          <div className={styles.container}>
            <span className={styles['terms-of-service']}>
              <span>
                <span>By </span>
              </span>
              <span>
                <span>
                  <span>clicking</span>
                </span>
              </span>
              <span>
                <span> Join, you agree to our </span>
              </span>
              <span>
                <span>
                  <a
                    className={styles['terms-of-service-link']}
                    href="https://okcupid.com/legal/terms"
                  >
                    <span>Terms of Service</span>
                  </a>
                </span>
              </span>
              <span>
                <span>. Learn about how we process and use your data in our </span>
              </span>
              <span>
                <span>
                  <a
                    className={styles['terms-of-service-link']}
                    href="https://okcupid.com/legal/privacy"
                  >
                    <span>Privacy Policy</span>
                  </a>
                </span>
              </span>
              <span>
                <span> and how we use cookies and similar technology in our </span>
              </span>
              <span>
                <span>
                  <a
                    className={styles['terms-of-service-link']}
                    href="https://okcupid.com/legal/cookies"
                  >
                    <span>Cookie Policy</span>
                  </a>
                </span>
              </span>
              <span>
                <span>.</span>
              </span>
            </span>
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
              <span>
                By tapping Join, you agree to our Terms of Service. Learn about how we process and
                use your data in our Privacy Policy and how we use cookies and similar technology in
                our Cookie Policy
              </span>
            </p>
          </div>
        </div>
        <div className={styles['splashdtf-footer']}>
          <div className={styles.container} style={{ color: '#000', paddingBottom: '0px' }}>
            <ul className={styles['splashdtf-footer-nav']} style={{ padding: '0px' }}>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/mobile"
                >
                  Apps
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/about"
                >
                  About
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/legal/privacy#third-parties"
                >
                  Ad Choices
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/press"
                >
                  Press
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/careers"
                >
                  Careers
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="https://help.okcupid.com"
                >
                  Support
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="https://theblog.okcupid.com"
                >
                  Blog
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="https://tech.okcupid.com"
                >
                  Tech Blog
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/s/conservative-dating-sites"
                >
                  Conservative Dating
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/legal/privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/legal/cookies"
                >
                  Cookie Policy
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/legal/terms"
                >
                  Terms
                </a>
              </li>
              <li className={styles['splashdtf-footer-nav-item']}>
                <a
                  className={styles['splashdtf-footer-nav-item-link']}
                  style={{ fontWeight: 600, fontSize: '13px' }}
                  href="/legal/safety-tips"
                >
                  Safety Tips
                </a>
              </li>
            </ul>
          </div>
          <div
            className={`${styles.container} ${styles['mobile-item']}`}
            style={{ paddingBottom: '0px' }}
          >
            <Icon type="instagram" style={{ fontSize: '30px', marginRight: '7px' }} />
            <Icon type="facebook" style={{ fontSize: '30px' }} />
          </div>
        </div>
      </div>
    );
  }
}
export default About;
