/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/react-in-jsx-scope */

import { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

@connect(({ loading }) => ({
  loading,
}))
class LandingPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }

  handleClickMenu(value) {
    const { number } = this.state;
    if (value === number) {
      this.setState({
        number: 0,
      });
    } else {
      this.setState({
        number: value,
      });
    }
  }

  render() {
    const { number } = this.state;
    return (
      <div className={styles['landing-page']}>
        <div className={styles.container}>
          <ul className={styles['menu-bar']}>
            <div className={styles.menu}>
              <li onClick={() => this.handleClickMenu(1)} className={styles.item}>
                <a className={styles.btn}>
                  <Icon type="user" />
                  Profile
                </a>
                <div className={number === 1 ? `${styles.smenu} ${styles.active}` : styles.smenu}>
                  <a href="#">Post</a>
                  <a href="#">Question</a>
                </div>
              </li>
              <li onClick={() => this.handleClickMenu(2)} className={styles.item}>
                <a className={styles.btn}>
                  <Icon type="mail" />
                  Message
                </a>
                <div className={number === 2 ? `${styles.smenu} ${styles.active}` : styles.smenu}>
                  <a href="#">New</a>
                  <a href="#">Sent</a>
                  <a href="#">Spam</a>
                </div>
              </li>
              <li onClick={() => this.handleClickMenu(3)} className={styles.item}>
                <a className={styles.btn}>
                  <Icon type="setting" />
                  Setting
                </a>
                <div className={number === 3 ? `${styles.smenu} ${styles.active}` : styles.smenu}>
                  <a href="#">Password</a>
                  <a href="#">Email</a>
                </div>
              </li>
              <li onClick={() => this.handleClickMenu(4)} className={styles.item}>
                <a href="#" className={styles.btn}>
                  <Icon type="poweroff" />
                  Logout
                </a>
              </li>
            </div>
          </ul>
          <div className={styles['slide-bar']}>
            <div className={styles['slide-bar-container']}>
              <div className={styles['main-slide']}>
                <div className={styles['left-box']}>
                  <div className={styles['left-image']} />
                </div>
                <div className={styles['center-box']}>
                  <div className={styles['center-image']} />
                </div>
                <div className={styles['right-box']}>
                  <div className={styles['right-image']} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
