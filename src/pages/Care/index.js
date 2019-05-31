/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable react/react-in-jsx-scope */

import { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import styles from './index.less';

@connect(({ authentication }) => ({
  getusercare: authentication.getusercare,
}))
class Care extends PureComponent {
  state = {
    dataUserCare: [],
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.getusercare !== nextProps.getusercare) {
      this.setState({
        dataUserCare: nextProps.getusercare,
      });
    }
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.dispatch({
      type: 'authentication/getusercare',
    });
  }

  handleClickChangeCare(value) {
    this.props.dispatch({
      type: 'authentication/changecare',
      payload: {
        userid: value.user_id.replace(/-/g, ''),
        care: false,
        type: 'user',
        user_id: value.user_id,
      },
    });
  }

  background(avatar, gender) {
    if (avatar) {
      return {
        backgroundImage: `url(http://cdn.henhoradio.net/images/ft/${avatar})`,
      };
    }
    if (gender === 'male')
      return {
        backgroundImage:
          'url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)',
      };
    return {
      backgroundImage:
        'url(http://cdn.henhoradio.net/images/ft/73cb3725-aa00-4f91-b6eb-8bff157fd714)',
    };
  }

  render() {
    const { dataUserCare } = this.state;
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
            {dataUserCare
              .sort((a, b) => new Date(b.created) - new Date(a.created))
              .map((v, i) => (
                <div key={i} className={styles['content-info-item']}>
                  <div className={styles.avatar}>
                    <div
                      className={styles['avatar-user']}
                      style={this.background(v.avatar, v.gender)}
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
                        onClick={() => this.handleClickChangeCare(v)}
                        className={styles['delete-care']}
                      >
                        Bỏ quan tâm
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

export default Care;
