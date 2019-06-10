/* eslint-disable react/button-has-type */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable camelcase */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'react-router-dom';
import { Drawer, Button, Radio, Icon, Pagination, Popconfirm } from 'antd';
import styles from './HHRFooter.less';

const RadioGroup = Radio.Group;
@connect(({ authentication }) => ({
  getusercare: authentication.getusercare,
}))
class HHRFooter extends PureComponent {
  state = {};

  render() {
    return (
      <div className={styles.footer}>
        <div className={styles['footer-content']}>
          <div className={`${styles.shop} ${styles.list}`}>
            <p className={styles['link-item']}>Shop</p>
            <p className={styles['link-item']}>Household</p>
            <p className={styles['link-item']}>Personal Care</p>
            <p className={styles['link-item']}>Baby {'&'} Kid</p>
            <p className={styles['link-item']}>Discover</p>
          </div>
          <div className={`${styles.about} ${styles.list}`}>
            <p className={styles['link-item']}>About</p>
            <p className={styles['link-item']}>FAQ</p>
            <p className={styles['link-item']}>About Grove</p>
            <p className={styles['link-item']}>Contact Us</p>
            <p className={styles['link-item']}>Careers ({"We're"} hiring!)</p>
            <p className={styles['link-item']}>InfluenProgram</p>
          </div>
          <div className={`${styles.values} ${styles.list}`}>
            <p className={styles['link-item']}>Value</p>
            <p className={styles['link-item']}>The Grove Standard</p>
            <p className={styles['link-item']}>Happiness Guaruntee</p>
            <p className={styles['link-item']}>Dirty Ingrediants List</p>
            <p className={styles['link-item']}>Saving the Rainforest</p>
            <p className={styles['link-item']}>Certifield B Corp</p>
          </div>
          <div className={`${styles.follow} ${styles.list}`}>
            <p className={styles['link-item']}>Fllow Groive</p>
            <p className={styles['link-item']}>
              <Icon type="facebook" theme="filled" /> Facebook
            </p>
            <p className={styles['link-item']}>
              <Icon type="instagram" theme="filled" /> Instagram
            </p>
            <p className={styles['link-item']}>
              <Icon type="twitter-circle" theme="filled" /> Twiter
            </p>
            <p className={styles['link-item']}>
              <Icon type="linkedin" theme="filled" /> LinkedIn
            </p>
          </div>
        </div>
        <div className={styles.security}>
          <div className={styles['left-item']}>
            <span>&copy; 2017, Grove Collaborative</span>
          </div>
          <div className={styles['right-item']}>
            <div className={styles.privacy}>Privacy Policy</div>
            <div className={styles.use}>Term of Use</div>
          </div>
        </div>
      </div>
    );
  }
}

export default HHRFooter;
