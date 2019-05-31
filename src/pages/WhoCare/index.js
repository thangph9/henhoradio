/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable react/react-in-jsx-scope */

import { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon } from 'antd';
import moment from 'moment';
import styles from './index.less';

@connect(({ authentication }) => ({
  getuserwhocare: authentication.getuserwhocare,
  getusercare: authentication.getusercare,
}))
class WhoCare extends PureComponent {
  state = {
    dataUserWhoCare: [],
    dataUserCare: [],
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.getuserwhocare !== nextProps.getuserwhocare) {
      this.setState({
        dataUserWhoCare: nextProps.getuserwhocare,
      });
    }
    if (this.props.getusercare !== nextProps.getusercare) {
      this.setState({
        dataUserCare: nextProps.getusercare,
      });
    }
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.dispatch({
      type: 'authentication/getuserwhocare',
    });
    this.props.dispatch({
      type: 'authentication/getusercare',
    });
  }

  checkCare(value) {
    const check = this.state.dataUserCare.find(v => v.user_id === value);
    if (check) return true;
    return false;
  }

  handleClickChangeCare(value, click, careItem) {
    this.props.dispatch({
      type: 'authentication/changecare',
      payload: {
        userid: value,
        care: !careItem,
        type: 'user',
      },
    });
    this.props.dispatch({
      type: 'authentication/getusercare',
    });
    this.setState({
      [click]: true,
    });
  }

  render() {
    return (
      <div className={styles['who-care-page']}>
        <div className={styles.container}>
          <div className={styles['user-care-item']}>
            <div className={styles['title-care']}>
              <div className={styles.title} />
              <div className={styles.title}>Tên người dùng</div>
              <div className={styles.title}>Thời gian quan tâm</div>
              <div className={styles.title}>Trang cá nhân</div>
              <div className={styles.title}>Chỉnh sửa</div>
            </div>
            {this.state.dataUserWhoCare
              .sort((a, b) => new Date(b.created) - new Date(a.created))
              .map((v, i) => (
                <div key={i} className={styles['content-info-item']}>
                  <div className={styles.avatar}>
                    <div
                      className={styles['avatar-user']}
                      style={{
                        backgroundImage:
                          'url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)',
                      }}
                    />
                  </div>
                  <div className={styles['info-user']}>
                    <div className={styles['more-info']}>{v.name}</div>
                    <div className={styles['more-info']}>
                      <span className={styles['name-of-user']}>{v.address}</span>
                      <span className={styles['age-of-user']}>{v.age} tuổi</span>
                    </div>
                  </div>
                  <div className={styles['info-user']}>
                    <div className={styles['more-info']}>
                      {moment(v.created).format('HH:mm MM/DD/YYYY')}
                    </div>
                  </div>
                  <div className={styles['info-user']}>
                    <div className={styles['more-info']}>
                      <Link to={`/home/other-profile?id=${v.user_id.replace(/-/g, '')}`}>
                        {v.name}
                      </Link>
                    </div>
                  </div>
                  <div className={styles['info-user']}>
                    <div className={styles['more-info']}>
                      <span
                        className={this.checkCare(v.user_id) ? styles.cared : styles['not-care']}
                        onClick={() =>
                          this.handleClickChangeCare(
                            v.user_id.replace(/-/g, ''),
                            `click-${i}`,
                            this.checkCare(v.user_id)
                          )
                        }
                      >
                        <Icon
                          style={!this.state[`click-${i}`] ? { animation: 'none' } : {}}
                          type="star"
                          theme="filled"
                        />
                        {this.checkCare(v.user_id) ? (
                          <span>Đã quan tâm</span>
                        ) : (
                          <span>Quan tâm lại</span>
                        )}
                      </span>
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

export default WhoCare;
